import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime,
}):
    from lib.pymidibridge.MidiBridgeWrapper import MidiBridgeWrapper


_PMB_MANUFACTURER_ID = b'\x00\x7c\x7d' 


class TestWrapper(unittest.TestCase):

    def test_send(self):
        midi = MockMidiController()
        wrapper = MidiBridgeWrapper(
            midi = midi
        )

        msg = [0xf0, 0x00, 0x23, 0x45, 0x45, 0x67, 0xf7]

        wrapper.send(msg)
        self.assertEqual(midi.messages_sent, [msg])

        wrapper.send(msg)
        self.assertEqual(midi.messages_sent, [msg, msg])


    def test_receive(self):
        midi = MockMidiController()
        bridge = MockBridge()

        wrapper = MidiBridgeWrapper(
            midi = midi
        )
        wrapper._MidiBridgeWrapper__bridge = bridge

        # Receive foreign message
        msg = [0xf0, 0x00, 0x23, 0x45, 0x45, 0x67, 0xf7]

        midi.next_receive_messages = [
            msg
        ]

        self.assertEqual(wrapper.receive(), msg)
        self.assertEqual(bridge.receive_calls, [])

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [])

        # Receive own message
        msg_2 = bytes((0xf0,) + tuple(_PMB_MANUFACTURER_ID) + (0x45, 0x67) + (0xf7,))

        midi.next_receive_messages = [
            msg_2
        ]
        bridge.receive_outputs[msg_2] = True

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [msg_2])
        self.assertEqual(MockTime.sleep_calls, [0.01])


    def test_callbacks(self):
        midi = MockMidiController()

        wrapper = MidiBridgeWrapper(
            midi = midi
        )

        manufacturer_id = [0x00, 0x23, 0x45]
        data = [0x45, 0x67]

        wrapper.send_system_exclusive(manufacturer_id, data)
        self.assertEqual(len(midi.messages_sent), 1)
        self.assertEqual(midi.messages_sent[0], (0xf0,) + manufacturer_id + data + (0xf7,))
        
        wrapper.send_system_exclusive(manufacturer_id, data)
        self.assertEqual(len(midi.messages_sent), 2)
        self.assertEqual(midi.messages_sent[1], (0xf0,) + manufacturer_id + data + (0xf7,))


