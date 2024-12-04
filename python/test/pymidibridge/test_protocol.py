import unittest

# Import subject under test
from lib.pymidibridge import *
from .mocks import *


class TestProtocol(unittest.TestCase):

    def test_send_receive(self):
        self._test_send_receive(
            path = "foo",
            data = " ",
            expected_num_messages = 2,
            use_event_handler = True
        )

        # Ca. 180 bytes
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 2,
            use_event_handler = False
        )

        # A bit over 2 kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 4,
            use_event_handler = True
        )

        # ~ 5kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 6,
            use_event_handler = True
        )


    def _test_send_receive(self, path, data, expected_num_messages, use_event_handler):
        midi = MockMidiSender()
        storage = MockStorageProvider()        

        storage.read_data = {
            "bar": "Hello",
            path: data
        }

        storage.outputs_size = {
            "bar": 5,
            path: len(data)
        }

        bridge = PyMidiBridge(
            midi = midi,
            storage = storage
        )

        # Get a request message for the path
        bridge.request(path)
        msg_request = midi.messages_sent[0]

        # Get some messages related to another file
        midi.messages_sent = []
        bridge.send("bar")
        msgs_other_file = [m for m in midi.messages_sent]
        self.assertGreaterEqual(len(msgs_other_file), 2)

        # Reset mocks
        midi.messages_sent = []
        storage.created_handles = []

        # Let the bridge receive a request message, to trigger it sending a file
        bridge.receive(msg_request)   

        self.assertEqual(len(storage.created_handles), 1)
        self.assertEqual(storage.created_handles[0].path, path)
        self.assertEqual(storage.created_handles[0].mode, "r")

        # Are amount of generated messages
        self.assertEqual(len(midi.messages_sent), expected_num_messages)
        
        # Feed back the generated MIDI messages to the bridge, yielding the input data again
        failure_tests_done = False
        cnt = 0
        msgs = [m for m in midi.messages_sent]
        for msg in msgs:
            midi.messages_sent = []

            bridge.receive(msg)

            if cnt == len(msgs) - 1:
                # Last message: Must have an ack message sent
                self._evaluate_ack(midi.last_message)

            cnt += 1

            if failure_tests_done:
                continue
            
            # Put in some invalid messages too: Different manufacturer ID (no Exception)
            bridge.receive(
                MockSystemExclusiveMessage(
                    manufacturer_id = [0x00, 0x01, 0x02],
                    data = [0x00, 0xac, 0xdc]
                )
            )

            # None (no Exception)
            bridge.receive(None)

            # Transmission errors: Change some byte (must return an error message)
            bridge.receive(
                MockSystemExclusiveMessage(
                    manufacturer_id = msg.manufacturer_id,
                    data = [msg.data[i] if i != 1 else msg.data[i - 1] for i in range(len(msg.data))]
                )
            )
            if use_event_handler:        
                self._evaluate_error(midi.last_message, "Checksum")

            # Different file ID: Take a data message from the other file (no exception)
            bridge.receive(msgs_other_file[len(msgs_other_file)-1])

            # Invalid chunk index: Repeat first chunk (must issue an error message)
            bridge.receive(self._generate_invalid_chunk(msg))
            self._evaluate_error(midi.last_message, "Invalid chunk")

            failure_tests_done = True

        # Check calls
        self.assertEqual(len(storage.created_handles), 2)
        self.assertEqual(storage.created_handles[1].path, path)
        self.assertEqual(storage.created_handles[1].mode, "a")

        # Compare results
        self.assertEqual(storage.created_handles[1].write_contents, data)


    # Generates an invalid chunk for the file_id in the passed message. The chunk 0 is used, because this is invalid after
    def _generate_invalid_chunk(self, midi_message, invalid_index = 999):
        bridge = PyMidiBridge(None, None)

        file_id = midi_message.data[4:8]
        chunk_index = bridge._number_2_bytes(invalid_index, 3)
        data = bridge._string_2_bytes("foo")

        payload = file_id + chunk_index + data
        checksum = bridge._get_checksum(payload)

        return MockSystemExclusiveMessage(
            manufacturer_id = PMB_MANUFACTURER_ID,
            data = PMB_DATA_MESSAGE + checksum + payload 
        )
    

    # Helper to check error messages
    def _evaluate_error(self, midi_message, token):
        self.assertEqual(midi_message.manufacturer_id, PMB_MANUFACTURER_ID)
        self.assertEqual(midi_message.data[:1], PMB_ERROR_MESSAGE)
        
        events = MockEventHandler()

        bridge = PyMidiBridge(
            midi = None, 
            storage = None,
            event_handler = events
        )        

        events.last_error = None
        
        bridge.receive(midi_message)
        
        self.assertIsNotNone(events.last_error, "Exception not thrown: " + token)
        self.assertIn(token, events.last_error)


    # Helper to check ack messages
    def _evaluate_ack(self, midi_message):
        self.assertEqual(midi_message.manufacturer_id, PMB_MANUFACTURER_ID)
        self.assertEqual(midi_message.data[:1], PMB_ACK_MESSAGE)
        
        events = MockEventHandler()

        bridge = PyMidiBridge(
            midi = None, 
            storage = None,
            event_handler = events
        )        

        events.last_ack = None        
        bridge.receive(midi_message)        
        self.assertIsNotNone(events.last_ack)
        

    def test_receive_reboot(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(SystemExit):
            bridge.receive(
                MockSystemExclusiveMessage(
                    manufacturer_id = PMB_MANUFACTURER_ID,
                    data = PMB_REBOOT_MESSAGE
                )
            )

    
    def test_send_no_path(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send(None)

        with self.assertRaises(Exception):
            bridge.send("")


    def test_request_file_not_found(self):
        midi = MockMidiSender()
        storage = MockStorageProvider()

        bridge = PyMidiBridge(
            midi = midi, 
            storage = storage
        )

        storage.outputs_size = {
            "foo": 5
        }

        storage.read_data = {
            "foo": "ghtgf"
        }

        bridge.request("foo")
        msg_request = midi.last_message

        bridge.receive(msg_request)
        
        storage.outputs_size["foo"] = -1

        bridge.receive(msg_request)
        self._evaluate_error(midi.last_message, "foo")
        self._evaluate_error(midi.last_message, "not found")


    def test_request_empty_file(self):
        midi = MockMidiSender()
        storage = MockStorageProvider()

        bridge = PyMidiBridge(
            midi = midi, 
            storage = storage
        )

        storage.outputs_size = {
            "foo": 0
        }

        storage.read_data = {
            "foo": ""
        }

        bridge.request("foo")
        msg_request = midi.last_message

        bridge.receive(msg_request)
        self._evaluate_error(midi.last_message, "foo")
        self._evaluate_error(midi.last_message, "empty")
        

############################################################################################################


    def test_request_file(self):
        self._test_request_file(" ")
        self._test_request_file("foo")
        self._test_request_file("/foo/path/to/bar.txt")


    def _test_request_file(self, path):
        midi = MockMidiSender()

        bridge = PyMidiBridge(
            midi = midi,
            storage = None
        )        
        
        bridge.request(path)

        msg_sent = midi.messages_sent[0]
        self.assertEqual(msg_sent.manufacturer_id, PMB_MANUFACTURER_ID)
        self.assertEqual(msg_sent.data[:1], PMB_REQUEST_MESSAGE)

        checksum = msg_sent.data[1:4]
        payload = bridge._bytes_2_string(msg_sent.data[4:])
        
        self.assertEqual(payload, path)
        self.assertEqual(checksum, bridge._get_checksum(msg_sent.data[4:]))


    def test_request_no_path(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.request(None)

        with self.assertRaises(Exception):
            bridge.request("")


############################################################################################################


    def test_generate_file_id(self):
        bridge = PyMidiBridge(None, None)
        buffer = []

        for i in range(100):
            file_id = bridge._generate_file_id()

            self.assertEqual(len(file_id), 4)
            self.assertNotIn(file_id, buffer)

            buffer.append(file_id)            


