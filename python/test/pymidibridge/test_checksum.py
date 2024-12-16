import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime
}):
    from lib.pymidibridge.PyMidiBridge import *


class TestChecksum(unittest.TestCase):

    def test_collisions(self):
        for length in range(10, 1000, 200):
            self._test_collisions(length)

    def _test_collisions(self, length):
        bridge = PyMidiBridge(None, None)

        data = self._generate_data(length)
        self.assertEqual(len(data), length)

        checksum = bridge._get_checksum(data)

        msg = "Data: " + repr(data) + "; Checksum: " + repr(checksum)

        self.assertEqual(len(checksum), 3, msg)
        
        # Change bits
        for i in range(2, length, 5):
            changed_list = list(data)
            if changed_list[i] < 127:
                changed_list[i] += 1
            else:
                changed_list[i] -= 1

            checksum_changed =  bridge._get_checksum(bytes(changed_list))

            self.assertNotEqual(checksum, checksum_changed)


    def _generate_data(self, length):
        return bytes([i % 256 for i in range(length)])


    def test_no_data(self):
        bridge = PyMidiBridge(None, None)

        self.assertEqual(bridge._get_checksum(bytes([])), b'\x00\x00\x00')
        self.assertEqual(bridge._get_checksum(None), b'\x00\x00\x00')
        self.assertEqual(bridge._get_checksum(0), b'\x00\x00\x00')

