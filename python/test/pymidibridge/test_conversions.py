import unittest

# Import subject under test
from lib.pymidibridge.pymidibridge import PyMidiBridge

from .mocks import *


class TestConversions(unittest.TestCase):

    def test_pack_unpack_bytes(self):
        # Check some examples
        self._test_pack_unpack_bytes([])

        self._test_pack_unpack_bytes([0])
        self._test_pack_unpack_bytes([1])
        self._test_pack_unpack_bytes([10])
        self._test_pack_unpack_bytes([255])

        self._test_pack_unpack_bytes([255, 0])
        self._test_pack_unpack_bytes([0, 255])

        self._test_pack_unpack_bytes([0, 127, 255])
        self._test_pack_unpack_bytes([255, 255, 255])
        self._test_pack_unpack_bytes([0, 0, 0])
        self._test_pack_unpack_bytes([127, 127, 127])

        self._test_pack_unpack_bytes([2, 0, 3, 4, 255, 200])
        self._test_pack_unpack_bytes([2, 0, 3, 4, 0])
        self._test_pack_unpack_bytes([2, 0, 3, 4, 255, 200, 222])


    def _test_pack_unpack_bytes(self, data):
        bridge = PyMidiBridge(None, None)
                
        packed = bridge._pack_bytes(bytes(data))
        
        self._check_half_bytes(packed)

        if data:
            self.assertNotEqual(data, packed)

        unpacked = bridge._unpack_bytes(packed)

        self.assertEqual(unpacked, bytes(data))


    def _check_half_bytes(self, data):
        for b in list(data):
            self.assertGreaterEqual(b, 0)
            self.assertLess(b, 128)


    def test_pack_bytes_sizes(self):
        # Check size of packed content
        bridge = PyMidiBridge(None, None)

        self.assertEqual(len(bridge._pack_bytes(bytes([255]))), 2)           
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255]))), 3)      
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255]))), 4) 
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255, 255]))), 5)
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255, 255, 255]))), 6)
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255, 255, 255, 255]))), 7)
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255, 255, 255, 255, 255]))), 8)
        self.assertEqual(len(bridge._pack_bytes(bytes([255, 255, 255, 255, 255, 255, 255, 255]))), 10)


    ##########################################################################################################


    def test_string_conversion(self):
        self._test_string_conversion("")
        self._test_string_conversion(" ")
        self._test_string_conversion("      ")

        self._test_string_conversion("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"§$%&/()=?*+#-_.:,;<>^°`´")
        self._test_string_conversion("äöüÖÄÜß")


    def _test_string_conversion(self, str):
        bridge = PyMidiBridge(None, None)

        encoded = bridge._string_2_bytes(str)    

        self._check_half_bytes(encoded)

        decoded = bridge._bytes_2_string(encoded)

        self.assertEqual(decoded, str)


    ##########################################################################################################


    def test_number_conversion(self):
        for i in range(99):
            self._test_number_conversion(i, 1, 2)

        for i in range(256):
            self._test_number_conversion(i, 2, 3)

        for i in range(0, 9999, 10):
            self._test_number_conversion(i, 3, 4)
            self._test_number_conversion(i, 5, 6)
            self._test_number_conversion(i, 7, 8)


    def _test_number_conversion(self, value, num_bytes, output_len):
        bridge = PyMidiBridge(None, None)

        encoded = bridge._number_2_bytes(value, num_bytes)

        self.assertEqual(len(encoded), output_len)
        self._check_half_bytes(encoded)

        decoded = bridge._bytes_2_number(encoded)

        self.assertEqual(decoded, value, "Value: " + repr(value) + "; Num Bytes: " + repr(num_bytes) + " Packed: " + repr(encoded))

