import unittest

# Import subject under test
from lib.pymidibridge.pymidibridge import *
from .mocks import *


class TestProtocol(unittest.TestCase):

    def test_send_receive(self):
        self._test_send_receive(
            path = "foo",
            data = " ",
            expected_num_messages = 2,
            use_event_handler = True,
            chunk_size = 100
        )

        # Ca. 180 bytes
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 3,
            use_event_handler = False,
            chunk_size = 100
        )

        # A bit over 2 kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 11,
            use_event_handler = True,
            chunk_size = 256
        )

        # ~ 5kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            expected_num_messages = 43,
            use_event_handler = True,
            chunk_size = 115
        )

        # Some UTF-8
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some UTF-8 content: €€~~{}[]¢[]",
            expected_num_messages = 2,
            use_event_handler = True,
            chunk_size = 115
        )


    def _test_send_receive(self, path, data, expected_num_messages, use_event_handler, chunk_size):
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
        bridge.request(path, chunk_size)
        msg_request = midi.messages_sent[0]

        # Get some messages related to another file
        midi.messages_sent = []
        bridge.send_file("bar", 20)
        msgs_other_file = [m for m in midi.messages_sent]
        self.assertGreaterEqual(len(msgs_other_file), 2)

        # Reset mocks
        midi.messages_sent = []
        storage.created_handles = []

        # Let the bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge.receive(msg_request), True)

        self.assertEqual(len(storage.created_handles), 1)
        self.assertEqual(storage.created_handles[0].path, path)
        self.assertEqual(storage.created_handles[0].mode, "r")

        for msg in midi.messages_sent:
            self.assertLessEqual(len(msg.data), chunk_size * 2 + 8)

        # Are amount of generated messages
        self.assertEqual(len(midi.messages_sent), expected_num_messages)
        
        # Feed back the generated MIDI messages to the bridge, yielding the input data again
        failure_tests_done = False
        cnt = 0
        msgs = [m for m in midi.messages_sent]
        for msg in msgs:
            midi.messages_sent = []

            self.assertEqual(bridge.receive(msg), True)

            if cnt == len(msgs) - 1:
                # Last message: Must have an ack message sent
                self._evaluate_ack(midi.last_message)

            cnt += 1

            if failure_tests_done:
                continue
            
            # Put in some invalid messages too: Different manufacturer ID (no Exception)
            self.assertEqual(
                bridge.receive(
                    MockSystemExclusiveMessage(
                        manufacturer_id = [0x00, 0x01, 0x02],
                        data = [0x00, 0xac, 0xdc]
                    )
                ),
                False
            )

            # None (no Exception)
            self.assertEqual(bridge.receive(None), False)

            # Transmission errors: Change some byte (must return an error message)
            midi.messages_sent = []
            self.assertEqual(
                bridge.receive(
                    MockSystemExclusiveMessage(
                        manufacturer_id = msg.manufacturer_id,
                        data = [msg.data[i] if i != 1 else msg.data[i - 1] for i in range(len(msg.data))]
                    )
                ), 
                True
            )
            if use_event_handler:        
                self._evaluate_error(midi.messages_sent, "Checksum")

            # Different file ID: Take a data message from the other file (no exception)
            self.assertEqual(bridge.receive(msgs_other_file[len(msgs_other_file)-1]), True)

            # Invalid chunk index: Repeat first chunk (must issue an error message)
            midi.messages_sent = []
            self.assertEqual(bridge.receive(self._generate_invalid_chunk(msg)), True)
            self._evaluate_error(midi.messages_sent, "Invalid chunk")

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
    def _evaluate_error(self, midi_messages, token):
        events = MockEventHandler()

        bridge = PyMidiBridge(
            midi = None, 
            storage = None,
            event_handler = events
        )        

        events.last_error = None
        
        for msg in midi_messages:
            self.assertEqual(bridge.receive(msg), True)
        
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
        self.assertEqual(bridge.receive(midi_message), True)
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
            bridge.send_file(None, 1)

        with self.assertRaises(Exception):
            bridge.send_file("", 1)


    def test_send_invalid_chunk_size(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send_file("foo", 0)

        with self.assertRaises(Exception):
            bridge.send_file("foo", -1)


    def test_send_no_storage(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send_file("foo", 1)

    
    def test_send_string_no_message(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send_string("", 1)


    def test_send_string_invalid_chunk_size(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send_string("message", -1)


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

        bridge.request("foo", 20)
        msg_request = midi.last_message

        self.assertEqual(bridge.receive(msg_request), True)
        
        storage.outputs_size["foo"] = -1

        midi.messages_sent = []
        self.assertEqual(bridge.receive(msg_request), True)
        
        self._evaluate_error(midi.messages_sent, "foo")
        self._evaluate_error(midi.messages_sent, "not found")


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

        bridge.request("foo", 20)
        msg_request = midi.last_message

        midi.messages_sent = []
        self.assertEqual(bridge.receive(msg_request), True)
        
        self._evaluate_error(midi.messages_sent, "foo")
        self._evaluate_error(midi.messages_sent, "empty")
        

############################################################################################################


    def test_request_file(self):
        self._test_request_file(" ", 10)
        self._test_request_file("foo", 1)
        self._test_request_file("/foo/path/to/bar.txt", 5600)


    def _test_request_file(self, exp_path, exp_chunk_size):
        midi = MockMidiSender()

        bridge = PyMidiBridge(
            midi = midi,
            storage = None
        )        
        
        bridge.request(exp_path, exp_chunk_size)

        msg_sent = midi.messages_sent[0]
        self.assertEqual(msg_sent.manufacturer_id, PMB_MANUFACTURER_ID)
        self.assertEqual(msg_sent.data[:1], PMB_REQUEST_MESSAGE)

        checksum = msg_sent.data[1:4]
        chunk_size = bridge._bytes_2_number(msg_sent.data[4:8])
        path = bridge._bytes_2_string(msg_sent.data[8:])
        
        self.assertEqual(path, exp_path)
        self.assertEqual(chunk_size, exp_chunk_size)
        self.assertEqual(checksum, bridge._get_checksum(msg_sent.data[4:]))


    def test_request_no_path(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.request(None, 20)

        with self.assertRaises(Exception):
            bridge.request("", 2)


    def test_request_invalid_chunk_size(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.request("foo", 0)

        with self.assertRaises(Exception):
            bridge.request("foo", -1)


############################################################################################################


    def test_generate_transmission_id(self):
        bridge = PyMidiBridge(None, None)
        buffer = []

        for i in range(100):
            transmission_id = bridge._generate_transmission_id()

            self.assertEqual(len(transmission_id), 4)
            self.assertNotIn(transmission_id, buffer)

            buffer.append(transmission_id)            


