###################################################################################################################
# 
# This script can transfer file (or other) data from/to a MIDI connection on CircuitPy boards.
#
###################################################################################################################

from sys import exit
from math import ceil

####################################################################################################################
 
# Bridge version
PMB_VERSION = "0.4.0"

# Manufacturer ID of PyMidiBridge
PMB_MANUFACTURER_ID = b'\x00\x7c\x7d' 

# Command prefix to request a file to be transfered.
# Syntax: [
#     *PMB_REQUEST_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Requested chunk size, 4 half-bytes>
#     <Path name as utf-8 bytes with no null termination>
# ]
PMB_REQUEST_MESSAGE = b'\x01'

# Command prefix to signal start of transfer. The transmission ID is a random requence used to identify 
# the file during the transfer, and is not used afterwards.
#
# Syntax: [
#     *PMB_START_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Transmission id, 2 half-bytes>,
#     <Transmission type, 1 half-byte>,
#     <Amount of chunks to be expected, 4 half-bytes>
#     <Path name as utf-8 bytes with no null termination>
# ]
PMB_START_MESSAGE = b'\x02'

# Command prefix for sending data chunks
# Syntax: [
#     *PMB_DATA_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Transmission id, 2 half-bytes>,
#     <Chunk index, 4 half-bytes>,
#     <Payload, variable length>
# ]
PMB_DATA_MESSAGE = b'\x03'

# Command prefix for the acknowledge message, which is sent to acknowledge a chunk.
# Syntax: [
#     *PMB_ACK_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Transmission id, 2 half-bytes>,
#     <Chunk index, 4 half-bytes>
# ]
PMB_ACK_MESSAGE = b'\x04'

# Message to reboot the device (calls sys.exit() which on CircuitPy triggers a reboot)
# Syntax: [
#     *PMB_REBOOT_MESSAGE
# ]
PMB_REBOOT_MESSAGE = b'\x66'


####################################################################################################################


# Transmission types
_PMB_TRANSMISSION_TYPE_FILE = b'\x00'
_PMB_TRANSMISSION_TYPE_ERROR = b'\x01'


####################################################################################################################


# All command prefixes above have to be exactly this long
_PMB_PREFIXES_LENGTH_HALFBYTES = 1 

# Size of the chunk index (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
_PMB_NUMBER_SIZE_FULLBYTES = 3
_PMB_NUMBER_SIZE_HALFBYTES = 4

# Length of the transmission id. This ID will be counted up to distinguish between transmissions. 
# (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
_PMB_TRANSMISSION_ID_LENGTH_FULLBYTES = 3
_PMB_TRANSMISSION_ID_LENGTH_HALFBYTES = 4

# Length of the checksum in the message. Must fit for 16 bits, so we need at least 3 MIDI half-bytes.
_PMB_CHECKSUM_LENGTH_FULLBYTES = 2
_PMB_CHECKSUM_LENGTH_HALFBYTES = 3

# Endianess for conversion of numbers (not for the data itself!)
_PMB_NUMBER_ENC_ENDIANESS = "big"

# Encoding for strings during transfer
_PMB_STRING_ENCODING = "utf-8"

# Chunk size for sending errors. Keep this small to be compatible to all clients.
_PMB_ERROR_CHUNK_SIZE = 100


####################################################################################################################
    

# Use an instance of this to use the functionality.
class PyMidiBridge:

    # Next transmission ID
    _NEXT_ID = 1   

    # midi_send:        Object to send SystemExclusive messages. See MidiSender.
    # storage:          Object to interact with storage. See StorageProvider.
    # event_handler:    Optional event handler, used to handle incoming errors as well as other stuff. 
    #                   See EventHaldler definition below. 
    #
    def __init__(self, midi, storage = None, event_handler = None):
        self._midi = midi
        self._storage = storage
        self._event_handler = event_handler

        # Transmission dict of dicts (for receiving stuff). Keys are the transmission IDs.
        self._receive_transmissions = {}

        # Transmission dict of dicts (for sending stuff). Keys are the transmission IDs.
        self._send_transmissions = {}


    ## Send Messages ##########################################################################################################


    # Open a file, and send it in chunks (also called internally when a request comes in)
    def send_file(self, path, chunk_size):
        if not path:
            raise Exception("No path")

        if chunk_size < 1:
            raise Exception("Invalid chunk size: " + repr(chunk_size))
        
        if not self._storage:
            raise Exception("No storage provider")

        # Check if file exists and see how many chunks we will need
        data_size = self._storage.size(path)
        if data_size < 0:
            raise Exception(repr(path) + " not found")
        
        if data_size == 0:
            raise Exception(repr(path) + " is empty")

        # Create transmission
        self._start_send_transmission({
            "path": path,
            "amountChunks": ceil(data_size / chunk_size),
            "chunkSize": chunk_size,
            "id": self._generate_transmission_id(),
            "type": _PMB_TRANSMISSION_TYPE_FILE
        })
        

    # Directly send a string, without using the storage provider.
    def send_string(self, path, message, chunk_size, transmission_type = _PMB_TRANSMISSION_TYPE_FILE):
        if not message:
            raise Exception("No message")

        if chunk_size < 1:
            raise Exception("Invalid chunk size: " + repr(chunk_size))

        # Create transmission
        self._start_send_transmission({
            "path": path,
            "amountChunks": ceil(len(message) / chunk_size),
            "chunkSize": chunk_size,
            "id": self._generate_transmission_id(),
            "message": message,
            "type": transmission_type
        })      


    # Adds a send transmission definition and sends the start message
    def _start_send_transmission(self, transmission):
        transmission["nextChunk"] = 0

        # Send start message
        self._send_start_message(
            path = transmission["path"], 
            transmission_id_bytes = transmission["id"],
            transmission_type = transmission["type"],
            amount_chunks = transmission["amountChunks"]
        )

        self._send_transmissions[transmission["id"]] = transmission

        self._send_next_chunk(transmission)


    # Send next chunk for the passed transmission
    def _send_next_chunk(self, transmission):        
        chunk_size = transmission["chunkSize"]

        # Read data        
        if transmission["type"] == _PMB_TRANSMISSION_TYPE_FILE:
            if not "handle" in transmission:
                # Open file for reading if not yet done
                transmission["handle"] = self._storage.open(transmission["path"], "r")

            chunk = transmission["handle"].read(chunk_size)
        else:
            chunk = transmission["message"][:chunk_size]
            transmission["message"] = transmission["message"][chunk_size:]
        
        self._send_chunk(transmission["id"], chunk, transmission["nextChunk"])

        transmission["nextChunk"] += 1

        if transmission["nextChunk"] == transmission["amountChunks"]:
            if transmission["type"] == _PMB_TRANSMISSION_TYPE_FILE:
                # End of file: There must not be any left overs
                if transmission["handle"].read(transmission["chunkSize"]):
                    raise Exception() #"Leftover data detected")

                transmission["handle"].close()
                transmission["handle"] = None

            else:
                if len(transmission["message"]) > 0:
                    raise Exception() #"Leftover data detected")
                
            return


    # Sends a MIDI message to request a file
    def request(self, path, chunk_size):
        if not path:
            raise Exception() #"No path")
        
        payload = self._number_2_bytes(chunk_size, _PMB_NUMBER_SIZE_FULLBYTES) + self._string_2_bytes(path)
        checksum = self._get_checksum(payload)

        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_REQUEST_MESSAGE + checksum + payload            
        )


    # Send the "Start of transmission" message
    def _send_start_message(self, path, transmission_id_bytes, transmission_type, amount_chunks):     
        amount_chunks_bytes = self._number_2_bytes(amount_chunks, _PMB_NUMBER_SIZE_FULLBYTES)   
        
        payload = transmission_id_bytes + transmission_type + amount_chunks_bytes + self._string_2_bytes(path)
        checksum = self._get_checksum(payload)
        
        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_START_MESSAGE + checksum + payload            
        )


    # Sends one chunk of data
    def _send_chunk(self, transmission_id_bytes, chunk, chunk_index):
        data_bytes = self._string_2_bytes(chunk)
        chunk_index_bytes = self._number_2_bytes(chunk_index, _PMB_NUMBER_SIZE_FULLBYTES)
        
        payload = transmission_id_bytes + chunk_index_bytes + data_bytes
        checksum = self._get_checksum(payload)
        
        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_DATA_MESSAGE + checksum + payload
        )


    # Generate a transmission ID (4 bytes)
    def _generate_transmission_id(self):
        result = self._number_2_bytes(self._NEXT_ID, _PMB_TRANSMISSION_ID_LENGTH_FULLBYTES)        
        self._NEXT_ID += 1        
        return result
    

    ## Receive Messages ##########################################################################################################


    # Must be called for every incoming MIDI message to receive data. This class only uses SysEx, so the incoming messages
    # have to feature the attributes "manufacturer_id" and "data" (both bytearrays) to be regarded
    def receive(self, midi_message):
        # Check if the message has the necessary attributes
        if not hasattr(midi_message, "manufacturer_id") or not hasattr(midi_message, "data"):
            return False
        
        # Is the message for us?
        if midi_message.manufacturer_id != PMB_MANUFACTURER_ID:
            return False
        
        # This determines what the sender of the message wants to do
        command_id = midi_message.data[:_PMB_PREFIXES_LENGTH_HALFBYTES]

        # Receive: Reboot
        if command_id == PMB_REBOOT_MESSAGE:
            exit()

        # Next there is the checksum for all messages
        checksum_bytes = midi_message.data[_PMB_PREFIXES_LENGTH_HALFBYTES:_PMB_PREFIXES_LENGTH_HALFBYTES + _PMB_CHECKSUM_LENGTH_HALFBYTES]
        payload = midi_message.data[_PMB_PREFIXES_LENGTH_HALFBYTES + _PMB_CHECKSUM_LENGTH_HALFBYTES:]

        try:
            # Checksum test
            if self._get_checksum(payload) != checksum_bytes:
                raise Exception("Checksum mismatch")

            # Receive: Message to request sending a file
            if command_id == PMB_REQUEST_MESSAGE:
                # Send file
                self._receive_request(payload)
                return True
            
            # All other messages have a file ID coming next, so we split that off the payload
            transmission_id_bytes = payload[:_PMB_TRANSMISSION_ID_LENGTH_HALFBYTES]
            payload = payload[_PMB_TRANSMISSION_ID_LENGTH_HALFBYTES:]

            # Receive: Start of transmission
            if command_id == PMB_START_MESSAGE:
                self._receive_start(transmission_id_bytes, payload)

            # Receive: Data
            elif command_id == PMB_DATA_MESSAGE:            
                self._receive_data(transmission_id_bytes, payload)

            # Ack message
            elif command_id == PMB_ACK_MESSAGE:
                self._receive_ack(transmission_id_bytes, payload)                

        except Exception as e:
            if self._event_handler:
                self.error(self._event_handler.get_trace(e))
            else:
                self.error(repr(e))
            print(e)

        return True

    # Request message received
    def _receive_request(self, payload):
        chunk_size = self._bytes_2_number(payload[:_PMB_NUMBER_SIZE_HALFBYTES])
        path = self._bytes_2_string(payload[_PMB_NUMBER_SIZE_HALFBYTES:])

        self.send_file(path, chunk_size)


    # Start receiving file data
    def _receive_start(self, transmission_id_bytes, payload):
        # Create a new transmission in the list
        transmission = {
            "lastChunk": -1,
            "id": transmission_id_bytes,
            "type": payload[:_PMB_PREFIXES_LENGTH_HALFBYTES],
            "amountChunks": self._bytes_2_number(payload[_PMB_PREFIXES_LENGTH_HALFBYTES:_PMB_NUMBER_SIZE_HALFBYTES + _PMB_PREFIXES_LENGTH_HALFBYTES]),
            "path": self._bytes_2_string(payload[_PMB_NUMBER_SIZE_HALFBYTES + _PMB_PREFIXES_LENGTH_HALFBYTES:])
        }

        if transmission["type"] == _PMB_TRANSMISSION_TYPE_FILE:
            if not self._storage:
                raise Exception("No storage provider")
        
            # Open file for appending
            transmission["handle"] = self._storage.open(transmission["path"], "a")
        else:
            # Initialize buffer
            transmission["buffer"] = ""

        self._receive_transmissions[transmission_id_bytes] = transmission


    # Receive file data
    def _receive_data(self, transmission_id_bytes, payload):
        if not transmission_id_bytes in self._receive_transmissions:
            raise Exception() #"Transmission not found")
        
        transmission = self._receive_transmissions[transmission_id_bytes]

        # Index of the chunk
        index = self._bytes_2_number(payload[:_PMB_NUMBER_SIZE_HALFBYTES])

        # Chunk data
        str_data = self._bytes_2_string(payload[_PMB_NUMBER_SIZE_HALFBYTES:])
    
        # Only accept if the chunk index is the one expected
        if index != transmission["lastChunk"] + 1:
            raise Exception("Invalid chunk") #"Invalid chunk " + repr(index) + ", expected " + repr(transmission["lastChunk"] + 1))
        
        transmission["lastChunk"] = index

        if transmission["type"] == _PMB_TRANSMISSION_TYPE_FILE:
            # Write to file
            transmission["handle"].write(str_data)
        else:
            # Initialize buffer
            transmission["buffer"] += str_data
    
        # Send the ack message
        self._send_ack_message(transmission["id"], index)
        
        # If this has been the last chunk, close the file handle and send ack message
        if index == transmission["amountChunks"] - 1:
            self._receive_finish(transmission)


    # Finish receiving and send acknowledge message
    def _receive_finish(self, transmission):
        if transmission["type"] == _PMB_TRANSMISSION_TYPE_FILE:
            # Finished (last chunk received)
            transmission["handle"].close()
            
        elif transmission["type"] == _PMB_TRANSMISSION_TYPE_ERROR:
            # Error received
            if self._event_handler:                
                self._event_handler.handle(transmission["buffer"])

        # Remove transmission from the receive list
        del self._receive_transmissions[transmission["id"]]


    # Receive the chunk ack message
    def _receive_ack(self, transmission_id_bytes, payload):        
        if transmission_id_bytes in self._send_transmissions:
            transmission = self._send_transmissions[transmission_id_bytes]

            chunk_index = self._bytes_2_number(payload)
            if chunk_index != transmission["nextChunk"] - 1:
                raise Exception("Invalid ack chunk: " + repr(chunk_index))

            self._send_next_chunk(transmission)

        if self._event_handler and (transmission["nextIndex"] == transmission["amountChunks"]):
            self._event_handler.transfer_finished(transmission_id_bytes)


    # Sends the "acknowledge successful chunk transfer" message
    def _send_ack_message(self, transmission_id_bytes, chunk_index):
        payload = transmission_id_bytes + self._number_2_bytes(chunk_index, _PMB_NUMBER_SIZE_FULLBYTES)
        checksum = self._get_checksum(payload)
        
        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_ACK_MESSAGE + checksum + payload
        )


    # Sends an error message
    def error(self, message, chunk_size = _PMB_ERROR_CHUNK_SIZE):
        self.send_string(
            path = "",
            message = message,
            chunk_size = chunk_size,
            transmission_type = _PMB_TRANSMISSION_TYPE_ERROR
        )


    ## Checksum ###########################################################################################################


    # Get checksum of bytes (only returns MIDI half-bytes)
    def _get_checksum(self, data):
        if not data:
            return bytes([0x00 for i in range(_PMB_CHECKSUM_LENGTH_HALFBYTES)])
        
        crc = self._crc16(data)
        return self._number_2_bytes(crc, _PMB_CHECKSUM_LENGTH_FULLBYTES) 


    # CRC-16-CCITT Algorithm
    # Taken from https://gist.github.com/oysstu/68072c44c02879a2abf94ef350d1c7c6
    def _crc16(self, data, poly = 0x6756):
        crc = 0xFFFF
        for b in data:
            cur_byte = 0xFF & b
            for _ in range(0, 8):
                if (crc & 0x0001) ^ (cur_byte & 0x0001):
                    crc = (crc >> 1) ^ poly
                else:
                    crc >>= 1
                cur_byte >>= 1
        crc = (~crc & 0xFFFF)
        crc = (crc << 8) | ((crc >> 8) & 0xFF)

        return crc & 0xFFFF


    ## Conversions ##########################################################################################################


    # String to bytearray conversion (only returns MIDI half-bytes)
    def _string_2_bytes(self, str):        
        return self._pack_bytes(str.encode(_PMB_STRING_ENCODING))

    # Bytearray to string conversion 
    def _bytes_2_string(self, data):
        return ''.join(self._unpack_bytes(data).decode(_PMB_STRING_ENCODING))    

    # Number to bytearray conversion (only returns MIDI half-bytes)
    def _number_2_bytes(self, num, num_bytes):
        return self._pack_bytes(num.to_bytes(num_bytes, _PMB_NUMBER_ENC_ENDIANESS))

    # Bytes to number conversion
    def _bytes_2_number(self, data):
        return int.from_bytes(self._unpack_bytes(data), _PMB_NUMBER_ENC_ENDIANESS)
    

    #########################################################################################################################


    # Packs full bytes into MIDI compatible half-bytes
    def _pack_bytes(self, data):
        return self._convert_bitlength(data, 8, 7, True)
    

    # Unpacks full bytes from MIDI compatible half-bytes
    def _unpack_bytes(self, data):
        return self._convert_bitlength(data, 7, 8, False)
    

    # Change bit length per byte
    def _convert_bitlength(self, data, bitlength_from, bitlength_to, append_leftovers):
        result = []
        buffer = []

        def flush():
            new_entry = 0x00
            
            while(len(buffer) < bitlength_to):
                buffer.append(False)

            for i in range(len(buffer)):
                e = buffer[i]
                if not e:
                    continue

                mask = (1 << (bitlength_to - 1 - i))
                new_entry |= mask

            result.append(new_entry)
            buffer.clear()

        for b in data:
            for i in range(bitlength_from):
                mask = (1 << (bitlength_from - 1 - i))
                buffer.append(b & mask == mask)

                if len(buffer) == bitlength_to:
                    flush()

        if append_leftovers and len(buffer) > 0:
            flush()

        return bytes(result)


# class EventHandler:
#
#     # Called when the bridge received an error message
#     def handle(self, message):
#         pass
#
#     # Called when the bridge received notice about a finished transfer on the other side
#     def transfer_finished(self, transmission_id_bytes):
#         pass
#
#     def get_trace(self, exception):
#         pass


# class MidiSender:
#     # Must send the passed data as MIDI system exclusive message
#     def send_system_exclusive(self, manufacturer_id, data):
#         pass


# class StorageProvider:
#
#     # Must return file size, or any negative number if the file does not exist
#     def size(self, path):
#         return 0
# 
#     # Must return an opened file handle. See StorageFileHandle class.
#     def open(self, path, mode):
#         return None


# class StorageFileHandle:
#
#     # Must write data to the file
#     def write(self, data):
#         pass
#
#     # Must read the specified amount of data from the file, return None if finished.
#     def read(self, amount_bytes):
#         return ""
#
#     # Must close the file handle
#     def close(self):
#         pass
