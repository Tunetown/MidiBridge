import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime,
    "adafruit_midi.system_exclusive": MockAdafruitMIDISystemExclusive()
}):
    from adafruit_midi.system_exclusive import SystemExclusive    
    from lib.pymidibridge.MidiBridgeWrapper import *


class TestWrapper(unittest.TestCase):

    def test_send(self):
        midi = MockMidiController()
        wrapper = MidiBridgeWrapper(
            midi = midi
        )

        msg = SystemExclusive(
            manufacturer_id = [0x00, 0x23, 0x45],
            data = [0x45, 0x67]
        )

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
        wrapper._bridge = bridge

        msg = SystemExclusive(
            manufacturer_id = [0x00, 0x23, 0x45],
            data = [0x45, 0x67]
        )

        midi.next_receive_messages = [
            msg
        ]

        self.assertEqual(wrapper.receive(), msg)
        self.assertEqual(bridge.receive_calls, [msg])

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [msg])

        midi.next_receive_messages = [
            msg
        ]
        bridge.receive_outputs[msg] = True

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [msg, msg])
        self.assertEqual(MockTime.sleep_calls, [0.01])


    def test_callbacks(self):
        midi = MockMidiController()

        wrapper = MidiBridgeWrapper(
            midi = midi
        )

        msg = SystemExclusive(
            manufacturer_id = [0x00, 0x23, 0x45],
            data = [0x45, 0x67]
        )

        wrapper.send_system_exclusive(msg.manufacturer_id, msg.data)
        self.assertEqual(len(midi.messages_sent), 1)
        self.assertEqual(midi.messages_sent[0].manufacturer_id, msg.manufacturer_id)
        self.assertEqual(midi.messages_sent[0].data, msg.data)

        wrapper.send_system_exclusive(msg.manufacturer_id, msg.data)
        self.assertEqual(len(midi.messages_sent), 2)
        self.assertEqual(midi.messages_sent[1].manufacturer_id, msg.manufacturer_id)
        self.assertEqual(midi.messages_sent[1].data, msg.data)


