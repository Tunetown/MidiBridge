import sys
import unittest
from unittest.mock import patch, MagicMock, call
import json

from .mocks import *

with patch.dict(sys.modules, {
    "time": MockTime,
    "os": MockOs
}):
    from lib.pymidibridge.MidiBridgeStorageProvider import MidiBridgeStorageProvider


class TestMidiBridgeStorageProvider(unittest.TestCase):

    def test_read(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [0, 0, 0, 0, 0, 0, 0]
        }

        fake_file = MagicMock()
        fake_file.read.side_effect = ["Hel", "lo", ""]

        with patch("builtins.open", return_value = fake_file, create = True) as mock_file:
            handle = storage.open("foo", "r")
            
            self.assertEqual(handle.read(3), "Hel")
            self.assertEqual(handle.read(3), "lo")
            self.assertEqual(handle.read(3), "")

            handle.close()

        mock_file.assert_called_with("foo", "r")
        fake_file.close.assert_called_once()
        

    def test_read_error_call_write(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [0, 0, 0, 0, 0, 0, 0]
        }

        fake_file = MagicMock()
        
        with patch("builtins.open", return_value = fake_file, create = True) as mock_file:
            handle = storage.open("foo", "r")
            
            mock_file.assert_called_with("foo", "r")

        with self.assertRaises(Exception):         
            handle.write("bar")

        
##########################################################################################################


    def test_append(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "temp"
        )

        MockOs.stat_outputs = {
            "foo": [0, 0, 0, 0, 0, 0, 0]
        }

        fake_file = MagicMock()
        output = {
            "temp": ""
        }
        def write(data):
            output["temp"] += data

        fake_file.write = write
        
        with patch("builtins.open", return_value = fake_file, create = True) as mock_file:
            handle = storage.open("foo", "a")

            self.assertEqual(mock_file.call_args_list, [
                call("temp", "w"),
                call("temp", "a")
            ])
            self.assertEqual(fake_file.close.call_count, 1)

            handle.write("Some")
            handle.write("Day")
            handle.write("My")
            handle.write("Data")
            handle.write("Will")
            handle.write("Come")

            handle.close()

        self.assertEqual(mock_file.call_args_list, [
            call("temp", "w"),
            call("temp", "a")
        ])

        self.assertEqual(MockOs.rename_calls, [{
            "source": "temp",
            "target": "foo"
        }])

        self.assertEqual(output["temp"], "SomeDayMyDataWillCome")

        self.assertEqual(fake_file.close.call_count, 2)


    def test_write_error_call_read(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [0, 0, 0, 0, 0, 0, 0]
        }

        fake_file = MagicMock()
        
        with patch("builtins.open", return_value = fake_file, create = True) as mock_file:
            handle = storage.open("foo", "a")            

        with self.assertRaises(Exception):         
            handle.read(3)


##########################################################################################################


    def test_size(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [0, 0, 0, 0, 0, 0, 0],
            "foo2": [0, 0, 0, 0, 0, 0, 4],
            "bar": [0, 0, 0, 0, 0, 0, 34987]
        }

        self.assertEqual(storage.size("foo"), 0)
        self.assertEqual(storage.size("foo2"), 4)
        self.assertEqual(storage.size("bar"), 34987)

        MockOs.stat_exception = OSError()
        MockOs.stat_exception.errno = 2

        self.assertEqual(storage.size("xxx"), -1)

        MockOs.stat_exception = OSError()
        MockOs.stat_exception.errno = 3

        with self.assertRaises(Exception):         
            storage.size("xxx")


##########################################################################################################

    def test_folder_listing(self):
        self._test_folder_listing("foo")
        self._test_folder_listing("foo/")

    def _test_folder_listing(self, input_path):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [16384, 0, 0, 0, 0, 0, 0],
            "foo/": [16384, 0, 0, 0, 0, 0, 0],
            "foo/bar": [0, 0, 0, 0, 0, 0, 10],
            "foo/hex": [16384, 0, 0, 0, 0, 0, 20],
            "foo/duu": [0, 0, 0, 0, 0, 0, 30],
        }

        MockOs.listdir_outputs = {
            "foo/": [
                "bar",
                "hex",
                "duu"
            ]
        }

        handle = storage.open(input_path, "r")
            
        content = ""
        while True:
            chunk = handle.read(1)
            if not chunk:
                break
            content += chunk
                    
        handle.close()

        dec = json.loads(content)

        self.assertEqual(dec, [
            [
                "bar",
                False,
                10
            ],
            [
                "hex",
                True,
                20
            ],
            [
                "duu",
                False,
                30
            ]
        ])

        self.assertEqual(storage.size("foo"), len(content))

        

    def test_folder_listing_error_call_write(self):
        storage = MidiBridgeStorageProvider(
            temp_file_path = "foo"
        )

        MockOs.stat_outputs = {
            "foo": [16384, 0, 0, 0, 0, 0, 0],
            "foo/bar": [0, 0, 0, 0, 0, 0, 10]
        }

        MockOs.listdir_outputs = {
            "foo/": [
                "bar"
            ]
        }

        fake_file = MagicMock()
        
        with patch("builtins.open", return_value = fake_file, create = True):
            handle = storage.open("foo", "r")            

        with self.assertRaises(Exception):         
            handle.write("234")