###################################################################################################################
# 
# This script can transfer file data from/to a MIDI connection on CircuitPy boards.
#
###################################################################################################################

from os import rename
from random import randrange

from adafruit_midi.system_exclusive import SystemExclusive

####################################################################################################################

# Bridge version
PMB_VERSION = "0.1.0"

# Manufacturer ID of PyMidiBridge
PMB_MANUFACTURER_ID = [0x00, 0xac, 0xdc]

# Message prefix to request a file to be transfered.
# Syntax: [
#     *PMB_REQUEST_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <Path name as null terminated string>
# ]
PMB_REQUEST_MESSAGE = bytes([0x01])    

# Message prefix to signal start of transfer. The file ID is a random requence used to identify 
# the file during the transfer, and is not used afterwards.
#
# Syntax: [
#     *PMB_START_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <File id, 2 half-bytes>,
#     <Path name as null terminated string>
# ]
PMB_START_MESSAGE = bytes([0x02])

# Message prefix for sending actual data
# Syntax: [
#     *PMB_DATA_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
#     <File id, 2 half-bytes>,
#     <Chunk index, 4 half-bytes>,
#     <Payload, variable length>
# ]
PMB_DATA_MESSAGE = bytes([0x03])

# Message prefix to signal end of transfer.
# Syntax: [
#     *PMB_FINISH_MESSAGE,
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>
#     <File id, 2 half-bytes>,
#     <Amount of chunks transferred, 4 half-bytes>
# ]
PMB_FINISH_MESSAGE = bytes([0x04])


####################################################################################################################


# All prefixes above have to be exactly this long
_PMB_PREFIXES_LENGTH = 1 

# Size of the chunk index (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
_PMB_CHUNK_INDEX_SIZE_BYTES = 3

# Length of the random file id in half-bytes
_PMB_FILE_ID_LENGTH_BYTES = 2

# Length of the checksum in the message. Must fit for 16 bits, so we need at least 3 MIDI half-bytes.
_PMB_CHECKSUM_LENGTH_BYTES = 3


####################################################################################################################


# Use an instance of this to use the functionality. Must be provided with some MIDI handler instance
# which provides a send(midi_message) method, and the receive method must be called on every incoming message.
class PyMidiBridge:

    def __init__(self, midi, temp_file_path):
        self._midi = midi
        self._temp_file_path = temp_file_path

        self._write_file_path = None
        self._write_file_id = None
        self._write_file = None
        self._last_chunk_index = 0    

    ## Send Messages ##########################################################################################################

    # Sends a MIDI message to request a file
    def request(self, path):
        if not path:
            raise Exception("No path")
        
        payload = self._string_2_bytes(path)
        checksum = self._get_checksum(payload)

        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_REQUEST_MESSAGE + checksum + payload
            )
        )

    # Open a file, and send it in chunks (also called internally when a request comes in)
    def send(self, path):
        if not path:
            raise Exception("No path")

        with open(path, "r") as file:
            file_id_bytes = self._generate_file_id()      

            # Send start message
            self._send_start_message(
                path = path, 
                file_id_bytes = file_id_bytes
            )

            # Transfer line by line
            chunk_index = 0
            for line in file:
                self._send_line(file_id_bytes, line, chunk_index)
                chunk_index += 1

            file.close()

            # Send file path and size at last
            self._send_finish_message(
                file_id_bytes = file_id_bytes, 
                amount_chunks = chunk_index
            )            

    # Send the "Start of transmission" message
    def _send_start_message(self, path, file_id_bytes):        
        payload = file_id_bytes + self._string_2_bytes(path)
        checksum = self._get_checksum(payload)
        
        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_START_MESSAGE + checksum + payload
            )
        )

    # Sends one line of data
    def _send_line(self, file_id_bytes, line, chunk_index):
        data_bytes = self._string_2_bytes(line)
        chunk_index_bytes = self._number_2_bytes(chunk_index, _PMB_CHUNK_INDEX_SIZE_BYTES)
        payload = file_id_bytes + chunk_index_bytes + data_bytes
        checksum = self._get_checksum(payload)
        
        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_DATA_MESSAGE + checksum + payload
            )
        )

    # Send the "End of transmission" message
    def _send_finish_message(self, file_id_bytes, amount_chunks):
        amount_chunks_bytes = self._number_2_bytes(amount_chunks, _PMB_CHUNK_INDEX_SIZE_BYTES)
        payload = file_id_bytes + amount_chunks_bytes
        checksum = self._get_checksum(payload)

        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_FINISH_MESSAGE + checksum + payload
            )
        )

    # Generate a random file ID
    def _generate_file_id(self):
        return bytes([randrange(0, 127), randrange(0, 127)])
    
    ## Receive Messages ##########################################################################################################

    # Must be called for every incoming MIDI message to receive data
    def receive(self, midi_message):
        if not isinstance(midi_message, SystemExclusive):
            return
        
        # Is the message for us?
        if midi_message.manufacturer_id != PMB_MANUFACTURER_ID:
            return
        
        # This determines what the sender of the message wants to do
        command_id = midi_message.data[:_PMB_PREFIXES_LENGTH]

        # Next there is the checksum for all messages
        checksum_bytes = midi_message.data[_PMB_PREFIXES_LENGTH:_PMB_PREFIXES_LENGTH + _PMB_CHECKSUM_LENGTH_BYTES]
        payload = midi_message.data[_PMB_PREFIXES_LENGTH + _PMB_CHECKSUM_LENGTH_BYTES:]

        if self._get_checksum(payload) != checksum_bytes:
            return

        # Receive: Message to request sending a file
        if command_id == PMB_REQUEST_MESSAGE:
            # Send file
            self.send(
                path = self._parse_string(payload)
            )
            return

        # All other messages have a file ID coming next, so we split that off the payload
        file_id_bytes = payload[:_PMB_FILE_ID_LENGTH_BYTES]
        payload = payload[_PMB_FILE_ID_LENGTH_BYTES:]

        # Receive: Start of transmission
        if command_id == PMB_START_MESSAGE:
            self._write_file_id = file_id_bytes
            self._write_file_path = self._bytes_2_string(payload)
            self._last_chunk_index = 0
                        
            # Clear temporary file if exists
            open(self._temp_file_path, "w").close()

            # Open temporary file for appending
            self._write_file = open(self._temp_file_path, "a")

        # Receive: Data
        elif command_id == PMB_DATA_MESSAGE:
            if file_id_bytes == self._write_file_id and self._write_file:
                index = self._bytes_2_number(payload[:_PMB_CHUNK_INDEX_SIZE_BYTES])
                str_data = self._bytes_2_string(payload[_PMB_CHUNK_INDEX_SIZE_BYTES:])
               
                # Only accept if the chunk index is the correct one for the next chunk
                if index == self._last_chunk_index + 1:
                    self._last_chunk_index = index

                    # Append to file
                    self._write_file.write(str_data)

        # Receive: End of transmission
        elif command_id == PMB_FINISH_MESSAGE:
            if self._write_file:
                # Close temporary file first
                self._write_file.close()
                self._write_file = None

                # If file IDs match and all chunks have been received, 
                # move the temporary file to its target path
                if file_id_bytes == self._write_file_id:                    
                    self._write_file_id = None

                    amount_chunks = self._bytes_2_number(payload)
                    
                    if amount_chunks == self._last_chunk_index + 1:
                        rename(self._temp_file_path, self._write_file_path)

    ## Checksum ###########################################################################################################

    # Get checksum of bytes (only returns MIDI half-bytes)
    def _get_checksum(self, data):
        if not data:
            return bytes([0x00, 0x00, 0x00])
        
        crc = self._crc16(data)
        return self._number_2_bytes(crc, 2) # Will result in 3 bytes when packed

    # CRC-16-CCITT Algorithm
    # Taken from https://gist.github.com/oysstu/68072c44c02879a2abf94ef350d1c7c6
    def _crc16(self, data, poly = 0x8408):
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
        return self._pack_bytes(bytes([ord(c) for c in str] + [0x00]))

    # Bytearray to string conversion 
    def _bytes_2_string(self, data):
        return ''.join(chr(int(c)) for c in list(self._unpack_bytes(data[:-1])))
    
    # Number to bytearray conversion (only returns MIDI half-bytes)
    def _number_2_bytes(self, num, num_bytes):
        return self._pack_bytes(num.to_bytes(num_bytes, "big"))

    # Bytes to number conversion
    def _bytes_2_number(self, data):
        return int.from_bytes(self._unpack_bytes(data), "big")
    
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

    