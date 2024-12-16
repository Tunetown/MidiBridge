import sys
import unittest
from unittest.mock import patch   # Necessary workaround! Needs to be separated.
from os import path
import json

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime
}):
    from lib.pymidibridge.PyMidiBridge import *


TEST_DATA_FOLDER = "/project/test/data/"
TEST_DATA_FILE_4BYTES = TEST_DATA_FOLDER + "pmb_numbers_4bytes.json"
TEST_DATA_FILE_6BYTES = TEST_DATA_FOLDER + "pmb_numbers_6bytes.json"


class TestNumbersWithReferenceData(unittest.TestCase):

    def test_write_ref_data(self):
        self._test_write_ref_data(TEST_DATA_FILE_4BYTES, 4)
        self._test_write_ref_data(TEST_DATA_FILE_6BYTES, 6)

    def _test_write_ref_data(self, file_path, num_bytes):
        if path.exists(file_path):
            return

        bridge = PyMidiBridge(None, None)

        results = []
        for i in range(0, 10000):            
            results.append(list(bridge._number_2_bytes(i, num_bytes)))

        handle = open(file_path, "w")
        handle.write(json.dumps(results))
        handle.close()

        print("Successfully written reference file " + file_path + ": " + repr(len(results)) + " numbers")


##############################################################################################################################


    def test_against_ref_data(self):    
        self._test_against_ref_data(TEST_DATA_FILE_4BYTES)
        self._test_against_ref_data(TEST_DATA_FILE_6BYTES)

    def _test_against_ref_data(self, file_path):     
        if not path.exists(file_path):
            return

        bridge = PyMidiBridge(None, None)

        # Load messages
        handle = open(file_path, "r")
        data_json = handle.read()
        handle.close()
        exp_numbers = json.loads(data_json)
        
        for i in range(0, 10000):
            data = exp_numbers[i]
            converted = bridge._bytes_2_number(data)
            
            self.assertEqual(converted, i)
        
