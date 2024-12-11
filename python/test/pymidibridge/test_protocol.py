import unittest

# Import subject under test
from lib.pymidibridge.PyMidiBridge import *
from .mocks import *


class TestProtocol(unittest.TestCase):

    def test_send_receive(self):
        self._test_send_receive(
            path = "foo",
            data = " ",
            chunk_size = 100
        )

        # Ca. 180 bytes
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            chunk_size = 100
        )

        # A bit over 2 kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            chunk_size = 256
        )

        # ~ 5kB
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\2§$%&/()=ß?´`+*#'-_.:,;<>",
            chunk_size = 115
        )

        # Some UTF-8
        self._test_send_receive(
            path = "/foo/path/to/bar.txt",
            data = "Some UTF-8 content: €€~~{}[]¢[]",
            chunk_size = 115
        )


    def _test_send_receive(self, path, data, chunk_size):
        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "bar": "Hello",
            path: data
        }

        storage_send.outputs_size = {
            "bar": 5,
            path: len(data)
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage = storage_send,
            event_handler = MockEventHandler()
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()
        storage_receive = MockStorageProvider()        

        bridge_receive = PyMidiBridge(
            midi = midi_receive,
            storage = storage_receive,
            event_handler = MockEventHandler()
        )

        # Get a request message for the path from the receiving side
        bridge_receive.request(path, chunk_size)
        msg_request = midi_receive.messages_sent[0]
        midi_receive.messages_sent = []

        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request), True)        
        self.assertEqual(len(storage_send.created_handles), 1)
        self.assertEqual(storage_send.created_handles[0].path, path)
        self.assertEqual(storage_send.created_handles[0].mode, "r")

        self.assertEqual(len(midi_send.messages_sent), 2)

        # Receive start message (no ack)        
        self.assertEqual(bridge_receive.receive(midi_send.messages_sent.pop(0)), True)
        self.assertEqual(len(midi_receive.messages_sent), 0)

        # Helper to check ack messages
        def evaluate_ack(midi_message, exp_chunk_index):
            self.assertEqual(midi_message.manufacturer_id, PMB_MANUFACTURER_ID)
            self.assertEqual(midi_message.data[:1], PMB_ACK_MESSAGE)

            bridge = PyMidiBridge(None, None)

            checksum = midi_message.data[1:4]
            chunk_size = bridge._bytes_2_number(midi_message.data[8:12])

            self.assertEqual(checksum, bridge._get_checksum(midi_message.data[4:]))
            self.assertEqual(chunk_size, exp_chunk_index)

        # Feed the generated MIDI messages to the receiving bridge, yielding the input data again
        chunk_index = 0
        while True:
            # Get next data message
            msg = midi_send.messages_sent.pop(0)
            self.assertLessEqual(len(msg.data), chunk_size * 2 + 8)

            # Feed data message to the receiving bridge (which must answer with ack)
            self.assertEqual(bridge_receive.receive(msg), True)

            self.assertEqual(len(midi_receive.messages_sent), 1)
            ack_msg = midi_receive.messages_sent.pop(0)
            evaluate_ack(ack_msg, chunk_index)

            # Feed the ack message back to the sender bridge to get the next data message
            self.assertEqual(bridge_send.receive(ack_msg), True)
            
            if not midi_send.messages_sent:
                # No further data
                break

            # There must be exactly 1 data message
            self.assertEqual(len(midi_send.messages_sent), 1, "Chunk: " + repr(chunk_index))

            chunk_index += 1

        # Check calls
        self.assertEqual(len(storage_receive.created_handles), 1)
        self.assertEqual(storage_receive.created_handles[0].path, path)
        self.assertEqual(storage_receive.created_handles[0].mode, "a")

        # Compare results
        self.assertEqual(storage_receive.created_handles[0].write_contents, data)
    

    def test_receive_invalid_data(self):
        midi = MockMidiSender()

        bridge = PyMidiBridge(
            midi = midi,
            storage = None
        )

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

        self.assertEqual(len(midi.messages_sent), 0)

        # None (no Exception)
        self.assertEqual(bridge.receive(None), False)

        self.assertEqual(len(midi.messages_sent), 0)

        # Other object (no Exception)
        self.assertEqual(bridge.receive(self), False)

        self.assertEqual(len(midi.messages_sent), 0)


    def test_receive_invalid_checksum(self):
        self._test_receive_invalid_checksum(True)
        self._test_receive_invalid_checksum(False)


    def _test_receive_invalid_checksum(self, use_event_handler):
        midi = MockMidiSender()
        storage = MockStorageProvider()
        events = MockEventHandler() if use_event_handler else None 

        storage.read_data = {
            "foo": "Hello"
        }

        storage.outputs_size = {
            "foo": 5
        }

        bridge = PyMidiBridge(
            midi = midi,
            storage = storage,
            event_handler = events
        )

        # Get a request message for the path
        bridge.request("foo", 20)
        msg_request = midi.messages_sent[0]
        midi.messages_sent = []

        # Transmission errors: Change some byte (must return an error message)
        self.assertEqual(
            bridge.receive(
                MockSystemExclusiveMessage(
                    manufacturer_id = msg_request.manufacturer_id,
                    data = [msg_request.data[i] if i != 1 else msg_request.data[i - 1] for i in range(len(msg_request.data))]
                )
            ), 
            True
        )        

        self._evaluate_error(bridge, midi, ["Checksum"])


    def test_receive_no_storage(self):
        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "foo": "Hello"
        }

        storage_send.outputs_size = {
            "foo": 5
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage = storage_send
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()

        bridge_receive = PyMidiBridge(
            midi = midi_receive
        )

        bridge_send.send_file("foo", 20)

        self.assertEqual(len(midi_send.messages_sent), 2)

        # Must throw when receiving start message
        bridge_receive.receive(midi_send.messages_sent.pop(0))

        self._evaluate_error(bridge_send, midi_receive, ["storage"])


    def test_receive_invalid_transmission(self):
        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "foo": "Hello"
        }

        storage_send.outputs_size = {
            "foo": 5
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage = storage_send
        )

        # Bridge for sending other data
        midi_send_2 = MockMidiSender()
        storage_send_2 = MockStorageProvider()        

        storage_send_2.read_data = {
            "foo": "Hello"
        }

        storage_send_2.outputs_size = {
            "foo": 5
        }

        bridge_send_2 = PyMidiBridge(
            midi = midi_send_2,
            storage = storage_send_2
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()

        bridge_receive = PyMidiBridge(
            midi = midi_receive,
            storage = MockStorageProvider()
        )

        # Main transmission
        bridge_send.send_file("foo", 20)
        self.assertEqual(len(midi_send.messages_sent), 2)

        # Other transmission
        bridge_send_2.send_file("foo", 20)
        self.assertEqual(len(midi_send_2.messages_sent), 2)

        # Start message for main transmission
        bridge_receive.receive(midi_send.messages_sent.pop(0))

        # Data message of another transmission
        bridge_receive.receive(midi_send_2.messages_sent.pop())

        self._evaluate_error(bridge_send, midi_receive, ["Transmission", "not found"])


    def test_receive_invalid_chunk(self):
        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "foo": "HelloHelloHelloHelloHelloHelloHelloHelloHelloHello"
        }

        storage_send.outputs_size = {
            "foo": 50
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage = storage_send
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()

        bridge_receive = PyMidiBridge(
            midi = midi_receive,
            storage = MockStorageProvider()
        )

        # Main transmission
        bridge_send.send_file("foo", 5)
        self.assertEqual(len(midi_send.messages_sent), 2)

        # Start message for main transmission
        bridge_receive.receive(midi_send.messages_sent.pop(0))

        # Data message #1
        bridge_receive.receive(midi_send.messages_sent.pop(0))
        
        # Ack message #1
        self.assertEqual(len(midi_send.messages_sent), 0)
        self.assertEqual(len(midi_receive.messages_sent), 1)
        
        bridge_send.receive(midi_receive.messages_sent.pop(0))

        self.assertEqual(len(midi_send.messages_sent), 1)

        # Data message #2
        data_message_2 = midi_send.messages_sent.pop(0)
        bridge_receive.receive(data_message_2)
        
        # Ack message #2
        self.assertEqual(len(midi_send.messages_sent), 0)
        self.assertEqual(len(midi_receive.messages_sent), 1)
        bridge_send.receive(midi_receive.messages_sent.pop(0))

        self.assertEqual(len(midi_send.messages_sent), 1)

        # Data message #2 again (invalid!)
        bridge_receive.receive(data_message_2)
        
        self._evaluate_error(bridge_send, midi_receive, ["Invalid", "chunk"])

        
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
            bridge.send_string("", "", 1)


    def test_send_string_invalid_chunk_size(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send_string("foo", "message", -1)


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
        
        self._evaluate_error(bridge, midi, ["foo", "not found"])


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
        
        self._evaluate_error(bridge, midi, ["foo", "empty"])
        

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


############################################################################################################


    # Helper to check error messages.
    def _evaluate_error(self, bridge, midi, tokens):
        self.assertEqual(len(midi.messages_sent), 2)

        events = MockEventHandler()
        other_midi = MockMidiSender()
        other_bridge = PyMidiBridge(
            midi = other_midi, 
            storage = MockStorageProvider(),
            event_handler = events
        )        

        events.last_error = None
        
        while True:
            if not midi.messages_sent:
                break

            msg = midi.messages_sent.pop(0)
            
            self.assertEqual(other_bridge.receive(msg), True)

            while other_midi.messages_sent:
                bridge.receive(other_midi.messages_sent.pop(0))
                
        self.assertIsNotNone(events.last_error, "Exception not thrown: " + repr(tokens))

        for token in tokens:
            self.assertIn(token, events.last_error)

