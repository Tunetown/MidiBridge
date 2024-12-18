import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime
}):
    from lib.pymidibridge.PyMidiBridge import *
    

class TestProtocolTimeout(unittest.TestCase):

    def test_receive_timeout(self):
        MockTime.monotonic_return = 1

        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "foo": "OllehCasklakldmcömpöosdpo sdvsdöv sdvsd vsdvgeg etrhtrhrt ret",
            "bar": "Hello sdv wrpv wprvmevmkefv ö löevö wöorvömklfsdvnlsd dvsdvsdvsdvsssvsd"
        }

        storage_send.outputs_size = {
            "foo": len(storage_send.read_data["foo"]),
            "bar": len(storage_send.read_data["bar"])
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage_factory = get_mock_storage_factory(storage_send),
            event_handler = MockEventHandler()
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()
        storage_receive = MockStorageProvider()        

        bridge_receive = PyMidiBridge(
            midi = midi_receive,
            storage_factory = get_mock_storage_factory(storage_receive),
            event_handler = MockEventHandler()
        )

        # Get a request message for the path from the receiving side
        bridge_receive.request("foo", 3)
        msg_request_foo = midi_receive.messages_sent[0]
        midi_receive.messages_sent = []

        # Get a request message for the path from the receiving side
        bridge_receive.request("bar", 4)
        msg_request_bar = midi_receive.messages_sent[0]
        midi_receive.messages_sent = []

        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request_foo), True)        
        
        # Receive start message 
        start_msg_1 = midi_send.messages_sent.pop(0)
        data_msg_1 = midi_send.messages_sent.pop(0)
        self.assertEqual(bridge_receive.receive(start_msg_1), True)
        self.assertEqual(len(midi_receive.messages_sent), 0)

        # Receive data message
        self.assertEqual(bridge_receive.receive(data_msg_1), True)

        # Get next data message
        self.assertEqual(len(midi_receive.messages_sent), 1)
        ack_msg_1 = midi_receive.messages_sent.pop(0)
        self.assertEqual(bridge_send.receive(ack_msg_1), True)
        data_msg_1b = midi_send.messages_sent.pop(0)
        
        # Let pass some virtual time so the first transmission will timeout
        MockTime.monotonic_return += 10
        
        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request_bar), True)        
        
        # Receive start message 
        start_msg_2 = midi_send.messages_sent.pop(0)
        data_msg_2 = midi_send.messages_sent.pop(0)
        self.assertEqual(bridge_receive.receive(start_msg_2), True)
        self.assertEqual(len(midi_receive.messages_sent), 0)

        # Receive data message 2 (must raise "Transmission not found")
        self.assertEqual(bridge_receive.receive(data_msg_1b), True)

        self._evaluate_error(bridge_receive, midi_receive, ["transmission", "not found"])


    def test_send_timeout(self):
        MockTime.monotonic_return = 1

        # Bridge for sending data
        midi_send = MockMidiSender()
        storage_send = MockStorageProvider()        

        storage_send.read_data = {
            "foo": "OllehCasklakldmcömpöosdpo sdvsdöv sdvsd vsdvgeg etrhtrhrt ret",
            "bar": "Hello sdv wrpv wprvmevmkefv ö löevö wöorvömklfsdvnlsd dvsdvsdvsdvsssvsd"
        }

        storage_send.outputs_size = {
            "foo": len(storage_send.read_data["foo"]),
            "bar": len(storage_send.read_data["bar"])
        }

        bridge_send = PyMidiBridge(
            midi = midi_send,
            storage_factory = get_mock_storage_factory(storage_send),
            event_handler = MockEventHandler()
        )

        # Bridge for receiving data
        midi_receive = MockMidiSender()
        storage_receive = MockStorageProvider()        

        bridge_receive = PyMidiBridge(
            midi = midi_receive,
            storage_factory = get_mock_storage_factory(storage_receive),
            event_handler = MockEventHandler()
        )

        # Get a request message for the path from the receiving side
        bridge_receive.request("foo", 3)
        msg_request_foo = midi_receive.messages_sent[0]
        midi_receive.messages_sent = []

        # Get a request message for the path from the receiving side
        bridge_receive.request("bar", 4)
        msg_request_bar = midi_receive.messages_sent[0]
        midi_receive.messages_sent = []

        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request_foo), True)        
        
        # Receive start message 
        start_msg_1 = midi_send.messages_sent.pop(0)
        data_msg_1 = midi_send.messages_sent.pop(0)
        self.assertEqual(bridge_receive.receive(start_msg_1), True)
        self.assertEqual(len(midi_receive.messages_sent), 0)

        # Receive data message
        self.assertEqual(bridge_receive.receive(data_msg_1), True)

        # Get next data message
        self.assertEqual(len(midi_receive.messages_sent), 1)
        ack_msg_1 = midi_receive.messages_sent.pop(0)

        # Let pass some virtual time so the first transmission will timeout
        MockTime.monotonic_return += 10
        
        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request_bar), True)        
        
        midi_send.messages_sent = []
        self.assertEqual(bridge_send.receive(ack_msg_1), True)

        self._evaluate_error(bridge_send, midi_send, ["transmission", "not found"])

        
############################################################################################################


    # Helper to check error messages.
    def _evaluate_error(self, bridge, midi, tokens):
        self.assertEqual(len(midi.messages_sent), 2)

        events = MockEventHandler()
        other_midi = MockMidiSender()
        other_bridge = PyMidiBridge(
            midi = other_midi, 
            storage_factory = get_mock_storage_factory(),
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

