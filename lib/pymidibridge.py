###################################################################################################################
# 
# This script can transfer file data from/to a MIDI connection on CircuitPy boards.
#
###################################################################################################################

from sys import exit
from math import ceil

####################################################################################################################
 
# Bridge version
PMB_VERSION = "0.2.0"

# Manufacturer ID of PyMidiBridge
PMB_MANUFACTURER_ID = b'\x00\xac\xdc' 

# Command prefix to request a file to be transfered.
# Syntax: [
#     *PMB_REQUEST_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Path name as null terminated string>
# ]
PMB_REQUEST_MESSAGE = b'\x01'

# Command prefix to signal start of transfer. The file ID is a random requence used to identify 
# the file during the transfer, and is not used afterwards.
#
# Syntax: [
#     *PMB_START_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <File id, 2 half-bytes>,
#     <Amount of chunks to be expected, 4 half-bytes>
#     <Path name as null terminated string>
# ]
PMB_START_MESSAGE = b'\x02'

# Command prefix for sending data chunks
# Syntax: [
#     *PMB_DATA_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <File id, 2 half-bytes>,
#     <Chunk index, 4 half-bytes>,
#     <Payload, variable length>
# ]
PMB_DATA_MESSAGE = b'\x03'

# Message to reboot the device (calls sys.exit() which on CircuitPy triggers a reboot)
PMB_REBOOT_MESSAGE = b'\x66'


####################################################################################################################


# All command prefixes above have to be exactly this long
_PMB_PREFIXES_LENGTH_HALFBYTES = 1 

# Size of the chunk index (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
_PMB_CHUNK_INDEX_SIZE_FULLBYTES = 3
_PMB_CHUNK_INDEX_SIZE_HALFBYTES = 4

# Length of the random file id (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
_PMB_FILE_ID_LENGTH_FULLBYTES = 3
_PMB_FILE_ID_LENGTH_HALFBYTES = 4

# Length of the checksum in the message. Must fit for 16 bits, so we need at least 3 MIDI half-bytes.
_PMB_CHECKSUM_LENGTH_FULLBYTES = 2
_PMB_CHECKSUM_LENGTH_HALFBYTES = 3

# Endianess for conversion of numbers (not for the data itself!)
_PMB_ENDIANESS = "big"


####################################################################################################################
    

# Use an instance of this to use the functionality.
class PyMidiBridge:

    _NEXT_ID = 1   # Next file ID

    # midi_send:        Object to send SystemExclusive messages. See MidiSender.
    # storage:          Object to interact with storage. See StorageProvider.
    # read_chunk_size:  Chunk size to read files (bytes)
    def __init__(self, midi, storage, read_chunk_size = 1024):
        self._midi = midi
        self._storage = storage
        self._read_chunk_size = read_chunk_size

        self._write_file_id = None       # Internal file ID currently received.
        self._write_file = None          # Write file handle
        self._write_amount_chunks = -1   # Amount of chunks to be received
        self._write_last_chunk = -1      # Counts received chunks


    ## Send Messages ##########################################################################################################


    # Sends a MIDI message to request a file
    def request(self, path):
        if not path:
            raise Exception("No path")
        
        payload = self._string_2_bytes(path)
        checksum = self._get_checksum(payload)

        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_REQUEST_MESSAGE + checksum + payload            
        )

    # Open a file, and send it in chunks (also called internally when a request comes in)
    def send(self, path):
        if not path:
            raise Exception("No path")

        file_id_bytes = self._generate_file_id()                  
        amount_chunks = ceil(self._storage.size(path) / self._read_chunk_size)

        file = self._storage.open(path, "r")

        # Send start message
        self._send_start_message(
            path = path, 
            file_id_bytes = file_id_bytes,
            amount_chunks = amount_chunks
        )

        # Transfer in chunks
        chunk_index = 0
        while(True):
            chunk = self._storage.read(file, self._read_chunk_size)
            if not chunk:
                break

            self._send_line(file_id_bytes, chunk, chunk_index)
            chunk_index += 1

        self._storage.close(file)

    # Send the "Start of transmission" message
    def _send_start_message(self, path, file_id_bytes, amount_chunks):     
        amount_chunks_bytes = self._number_2_bytes(amount_chunks, _PMB_CHUNK_INDEX_SIZE_FULLBYTES)   
        
        payload = file_id_bytes + amount_chunks_bytes + self._string_2_bytes(path)
        checksum = self._get_checksum(payload)
        
        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_START_MESSAGE + checksum + payload            
        )

    # Sends one line of data
    def _send_line(self, file_id_bytes, line, chunk_index):
        data_bytes = self._string_2_bytes(line)
        chunk_index_bytes = self._number_2_bytes(chunk_index, _PMB_CHUNK_INDEX_SIZE_FULLBYTES)
        
        payload = file_id_bytes + chunk_index_bytes + data_bytes
        checksum = self._get_checksum(payload)
        
        self._midi.send_system_exclusive(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_DATA_MESSAGE + checksum + payload
        )

    # Generate a random file ID (4 bytes)
    def _generate_file_id(self):
        result = self._number_2_bytes(self._NEXT_ID, _PMB_FILE_ID_LENGTH_FULLBYTES)
        
        self._NEXT_ID += 1
        
        return result
    

    ## Receive Messages ##########################################################################################################


    # Must be called for every incoming MIDI message to receive data. This class only uses SysEx, so the incoming messages
    # have to feature the attributes "manufacturer_id" and "data" (both bytearrays) to be regarded
    def receive(self, midi_message):
        # Check if the message has the necessary attributes
        if not hasattr(midi_message, "manufacturer_id") or not hasattr(midi_message, "data"):
            return
        
        # Is the message for us?
        if midi_message.manufacturer_id != PMB_MANUFACTURER_ID:
            return
        
        # This determines what the sender of the message wants to do
        command_id = midi_message.data[:_PMB_PREFIXES_LENGTH_HALFBYTES]

        # Receive: Reboot
        if command_id == PMB_REBOOT_MESSAGE:
            exit()

        # Next there is the checksum for all messages
        checksum_bytes = midi_message.data[_PMB_PREFIXES_LENGTH_HALFBYTES:_PMB_PREFIXES_LENGTH_HALFBYTES + _PMB_CHECKSUM_LENGTH_HALFBYTES]
        payload = midi_message.data[_PMB_PREFIXES_LENGTH_HALFBYTES + _PMB_CHECKSUM_LENGTH_HALFBYTES:]

        if self._get_checksum(payload) != checksum_bytes:
            return

        # Receive: Message to request sending a file
        if command_id == PMB_REQUEST_MESSAGE:
            # Send file
            self.send(
                path = self._bytes_2_string(payload)
            )
            return

        # All other messages have a file ID coming next, so we split that off the payload
        file_id_bytes = payload[:_PMB_FILE_ID_LENGTH_HALFBYTES]
        payload = payload[_PMB_FILE_ID_LENGTH_HALFBYTES:]

        # Receive: Start of transmission
        if command_id == PMB_START_MESSAGE:
            self._write_last_chunk = -1
            self._write_file_id = file_id_bytes
            
            self._write_amount_chunks = self._bytes_2_number(payload[:_PMB_CHUNK_INDEX_SIZE_HALFBYTES])
            write_file_path = self._bytes_2_string(payload[_PMB_CHUNK_INDEX_SIZE_HALFBYTES:])
                                    
            # Clear file if exists            
            self._storage.clear(write_file_path)

            # Open file for appending
            self._write_file = self._storage.open(write_file_path, "a")

        # Receive: Data
        elif command_id == PMB_DATA_MESSAGE:            
            if file_id_bytes == self._write_file_id and self._write_file:
                index = self._bytes_2_number(payload[:_PMB_CHUNK_INDEX_SIZE_HALFBYTES])
                str_data = self._bytes_2_string(payload[_PMB_CHUNK_INDEX_SIZE_HALFBYTES:])
               
                # Only accept if the chunk index is the one expected
                if index == self._write_last_chunk + 1:
                    self._write_last_chunk = index

                    # Append to file
                    self._storage.append(self._write_file, str_data)

                    if index == self._write_amount_chunks - 1:
                        # Finished (last chunk received)
                        self._write_file_id = None

                        # Close temporary file
                        self._storage.close(self._write_file)
                        self._write_file = None


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
        return self._pack_bytes(bytes([ord(c) for c in str]) + b'\x00')

    # Bytearray to string conversion 
    def _bytes_2_string(self, data):
        return ''.join(chr(int(c)) for c in list(self._unpack_bytes(data[:-1])))
    
    # Number to bytearray conversion (only returns MIDI half-bytes)
    def _number_2_bytes(self, num, num_bytes):
        return self._pack_bytes(num.to_bytes(num_bytes, _PMB_ENDIANESS))

    # Bytes to number conversion
    def _bytes_2_number(self, data):
        return int.from_bytes(self._unpack_bytes(data), _PMB_ENDIANESS)
    
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

    
# class MidiSender:
#     # Must send the passed data as MIDI system exclusive message
#     def send_system_exclusive(self, manufacturer_id, data):
#         pass


# class StorageProvider:
#
#     # Must clear the contents of the file if exists
#     def clear(self, path):
#         pass
#
#     # Must return an opened file handle
#     def open(self, path, mode):
#         return None
#
#     # Must append data to the passed file handle
#     def append(self, handle, data):
#         pass
#
#     # Must read from the file handle
#     def read(self, handle, amount_bytes):
#         return ""
#
#     # Must close the file handle
#     def close(self, handle):
#         handle.close()
#
#     # Must return file size
#     def size(self, path):
#         return 0