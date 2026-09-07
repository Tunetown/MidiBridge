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

        msg = b'\xf0\x00\x23\x45\x45\x67\xf7'

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
        msg = b'\xf0\x00\x23\x45\x45\x67\xf7'

        midi.next_receive_messages = [
            msg
        ]

        self.assertEqual(wrapper.receive(), msg)
        self.assertEqual(bridge.receive_calls, [msg])

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [msg, None])

        # Receive own message
        msg_2 = b'\xf0' + _PMB_MANUFACTURER_ID + b'\x45\x67\xf7'

        midi.next_receive_messages = [
            msg_2
        ]
        bridge.receive_outputs[msg_2] = True

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [msg, None, msg_2])
        self.assertEqual(MockTime.sleep_calls, [0.01])


    def test_callbacks(self):
        midi = MockMidiController()

        wrapper = MidiBridgeWrapper(
            midi = midi
        )

        msg = b'\xf0\x00\x23\x45\x56\x67\xf7'

        wrapper.send(msg)
        self.assertEqual(len(midi.messages_sent), 1)
        self.assertEqual(midi.messages_sent[0], msg)
        
        wrapper.send(msg)
        self.assertEqual(len(midi.messages_sent), 2)
        self.assertEqual(midi.messages_sent[1], msg)


