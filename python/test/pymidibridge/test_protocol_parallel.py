import unittest

from .mocks import *
from lib.pymidibridge.PyMidiBridge import *
    

class TestProtocolParallel(unittest.TestCase):

    def test_send_receive_parallel(self):
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

        # Let the sending bridge receive a request message, to trigger it sending a file
        self.assertEqual(bridge_send.receive(msg_request_bar), True)        
        
        # Receive start message 
        start_msg_2 = midi_send.messages_sent.pop(0)
        data_msg_2 = midi_send.messages_sent.pop(0)
        self.assertEqual(bridge_receive.receive(start_msg_2), True)
        self.assertEqual(len(midi_receive.messages_sent), 0)

        # Receive data messages
        self.assertEqual(bridge_receive.receive(data_msg_2), True)
        self.assertEqual(bridge_receive.receive(data_msg_1), True)

        self.assertEqual(len(midi_receive.messages_sent), 2)
        ack_msg_2 = midi_receive.messages_sent.pop(0)
        ack_msg_1 = midi_receive.messages_sent.pop(0)
        self.assertEqual(bridge_send.receive(ack_msg_1), True)
        self.assertEqual(bridge_send.receive(ack_msg_2), True)

        # Feed the generated MIDI messages to the receiving bridge, yielding the input data again
        while True:
            if not midi_send.messages_sent:
                # No further data
                break

            # Get next data message
            msg = midi_send.messages_sent.pop(0)
            
            # Feed data message to the receiving bridge (which must answer with ack)
            self.assertEqual(bridge_receive.receive(msg), True)

            self.assertEqual(len(midi_receive.messages_sent), 1)
            ack_msg = midi_receive.messages_sent.pop(0)

            # Feed the ack message back to the sender bridge to get the next data message
            self.assertEqual(bridge_send.receive(ack_msg), True)
            
        # Check calls
        self.assertEqual(len(storage_receive.created_handles), 2)
        self.assertEqual(storage_receive.created_handles[0].path, "foo")
        self.assertEqual(storage_receive.created_handles[0].mode, "a")
        self.assertEqual(storage_receive.created_handles[0].closed, True)

        self.assertEqual(storage_receive.created_handles[1].path, "bar")
        self.assertEqual(storage_receive.created_handles[1].mode, "a")
        self.assertEqual(storage_receive.created_handles[1].closed, True)

        # Compare results
        self.assertEqual(storage_receive.created_handles[0].write_contents, storage_send.read_data["foo"])
        self.assertEqual(storage_receive.created_handles[1].write_contents, storage_send.read_data["bar"])
    
