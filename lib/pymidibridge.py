###################################################################################################################
# 
# This script can transfer file data from/to a MIDI connection on CircuitPy boards.
#
###################################################################################################################

from adafruit_midi.system_exclusive import SystemExclusive

# Manufacturer ID of PyMidiBridge
PMB_MANUFACTURER_ID = [0x00, 0xac, 0xdc]

# Message prefix to request a file to be transfered.
# Syntax: [
#     *PMB_REQUEST_MESSAGE,
#     <Path name as null terminated string>
# ]
PMB_REQUEST_MESSAGE = bytes([0x01])    

# Message to signal start of transfer. The file ID is a random requence used to identify 
# the file during the transfer, and is not used afterwards.
#
# Syntax: [
#     *PMB_START_MESSAGE,
#     <File id, 2 half-bytes>,
#     <Path name as null terminated string>
# ]
PMB_START_MESSAGE = bytes([0x02])

# Message with data
# Syntax: [
#     *PMB_DATA_MESSAGE,
#     <File id, 2 half-bytes>,
#     <Chunk index, 4 half-bytes>
#     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over file id + chunk index + payload)>
#     <Payload, variable length>
# ]
PMB_DATA_MESSAGE = bytes([0x03])

# Message to signal end of transfer.
# Syntax: [
#     *PMB_FINISH_MESSAGE,
#     <File id, 2 half-bytes>,
#     <Amount of chunks transferred, 4 half-bytes>
# ]
PMB_FINISH_MESSAGE = bytes([0x04])


####################################################################################################################


# Use an instance of this to use the functionality. Must be provided with some MIDI handler instance
# which provides a send(midi_message) method, and the receive method must be called on every incoming message.
class PyMidiBridge:

    def __init__(self, midi):
        self._midi = midi
        self._converter = _Converter(midi)
        
        self._file_id = None
        self._buffer = ""

    # Sends a MIDI message to request a file
    def request(self, path):
        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_REQUEST_MESSAGE + self._string_to_bytes(path)
            )
        )

    # Must be called for every incoming MIDI message to receive data
    def receive(self, midi_message):
        if not isinstance(midi_message, SystemExclusive):
            return
        
        if midi_message.manufacturer_id != PMB_MANUFACTURER_ID:
            return
        
        # Trigger sending a file
        if midi_message.data[:len(PMB_REQUEST_MESSAGE)] == PMB_REQUEST_MESSAGE:
            self._send_file(
                path = self._parse_string(
                    bytes = midi_message.data[len(PMB_REQUEST_MESSAGE):-1])
            )

        # Receive: Start of transmission
        if midi_message.data[:len(PMB_START_MESSAGE)] == PMB_START_MESSAGE:
            self._file_id = midi_message.data[len(PMB_START_MESSAGE):len(PMB_START_MESSAGE)+2]
            self._file_path = self._parse_string(
                bytes = midi_message.data[len(PMB_START_MESSAGE + 2):-1]
            )
            self._buffer = ""

        # Receive: Data
        if midi_message.data[:len(PMB_DATA_MESSAGE)] == PMB_DATA_MESSAGE:
            file_id = midi_message.data[len(PMB_DATA_MESSAGE):len(PMB_DATA_MESSAGE)+2]
            if file_id == self._file_id:
                checksum = midi_message.data[len(PMB_DATA_MESSAGE) + 2:len(PMB_DATA_MESSAGE) + 5]
                data = midi_message.data[len(PMB_DATA_MESSAGE) + 5:]

                self._buffer += self._converter.parse(data, checksum)

        # Receive: End of transmission
        if midi_message.data[:len(PMB_FINISH_MESSAGE)] == PMB_FINISH_MESSAGE:
            self._file_id = midi_message.data[len(PMB_FINISH_MESSAGE):len(PMB_FINISH_MESSAGE)+2]
            if file_id == self._file_id:
                # self._write_file
                pass
        
    # Open a file, and send it
    def _send_file(self, path):
        with open(path, "r") as file:
            # Send start message
            self._send_start_message()

            # Transfer line by line
            for line in file:
                self._converter.send(line)

            # Send file path and size at last
            self._send_finish_message()

            file.close()

    # Send the "Start of transmission" message
    def _send_start_message(self):
        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_START_MESSAGE
            )
        )

    # Send the "End of transmission" message
    def _send_finish_message(self):
        self._midi.send(
            SystemExclusive(
                manufacturer_id = PMB_MANUFACTURER_ID,
                data = PMB_FINISH_MESSAGE
            )
        )

    # String to bytearray conversion
    def _string_to_bytes(self, str):
        return bytes([ord(c) for c in str] + [0x00])

    # Bytearray to string conversion
    def _parse_string(self, bytes):
        return ''.join(chr(int(c)) for c in list(bytes))


###################################################################################################


class _Converter:

    def __init__(self, midi):
        self._midi = midi

    def send(self, str):
        pass

    # CRC-16-CCITT Algorithm
    # Taken from https://gist.github.com/oysstu/68072c44c02879a2abf94ef350d1c7c6
    def crc16(data: bytes, poly=0x8408):
        data = bytearray(data)
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