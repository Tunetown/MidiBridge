import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime,
    "adafruit_midi.system_exclusive": MockAdafruitMIDISystemExclusive()
}):
    from adafruit_midi.system_exclusive import SystemExclusive    
    from lib.pymidibridge.MidiBridgeWrapper import MidiBridgeWrapper


_PMB_MANUFACTURER_ID = b'\x00\x7c\x7d' 


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

        with patch.dict(sys.modules, {
            "adafruit_midi.system_exclusive": MockAdafruitMIDISystemExclusive()
        }):

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
        msg = SystemExclusive(
            manufacturer_id = [0x00, 0x23, 0x45],
            data = [0x45, 0x67]
        )

        midi.next_receive_messages = [
            msg
        ]

        self.assertEqual(wrapper.receive(), msg)
        self.assertEqual(bridge.receive_calls, [])

        self.assertEqual(wrapper.receive(), None)
        self.assertEqual(bridge.receive_calls, [])

        # Receive own message
        msg_2 = SystemExclusive(
            manufacturer_id = _PMB_MANUFACTURER_ID,
            data = [0x45, 0x67]
        )

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

        msg = SystemExclusive(
            manufacturer_id = [0x00, 0x23, 0x45],
            data = [0x45, 0x67]
        )

        with patch.dict(sys.modules, {
            "adafruit_midi.system_exclusive": MockAdafruitMIDISystemExclusive()
        }):

            wrapper.send_system_exclusive(msg.manufacturer_id, msg.data)
            self.assertEqual(len(midi.messages_sent), 1)
            self.assertEqual(midi.messages_sent[0].manufacturer_id, msg.manufacturer_id)
            self.assertEqual(midi.messages_sent[0].data, msg.data)

            wrapper.send_system_exclusive(msg.manufacturer_id, msg.data)
            self.assertEqual(len(midi.messages_sent), 2)
            self.assertEqual(midi.messages_sent[1].manufacturer_id, msg.manufacturer_id)
            self.assertEqual(midi.messages_sent[1].data, msg.data)


