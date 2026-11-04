import unittest
from unittest.mock import patch

from lib.pymidibridge import pymidibridge


class Midi:
    def __init__(self):
        self.messages = []

    def send(self, message):
        self.messages.append(message)


class Events:
    def __init__(self):
        self.errors = []

    def handle(self, message):
        self.errors.append(message)

    def get_trace(self, exception):
        return str(exception)


class TestReceiveStartTimeout(unittest.TestCase):
    def _receive_delayed_first_chunk(self, elapsed_seconds):
        now = [1]
        with patch.object(pymidibridge, 'monotonic', side_effect=lambda: now[0]):
            outgoing = Midi()
            incoming = Midi()
            events = Events()
            sender = pymidibridge.PyMidiBridge(outgoing)
            receiver = pymidibridge.PyMidiBridge(incoming, event_handler=events)

            # Error transfers use the same receive lifecycle without a storage provider.
            sender.error('stalled')
            receiver.receive(outgoing.messages.pop(0))
            delayed_data = outgoing.messages.pop(0)
            now[0] += elapsed_seconds
            sender.error('active')
            receiver.receive(outgoing.messages.pop(0))
            receiver.receive(delayed_data)
            delayed_response = list(incoming.messages)
            receiver.receive(outgoing.messages.pop(0))
            return events.errors, delayed_response

    def test_start_without_data_expires_when_another_transfer_triggers_cleanup(self):
        events, response = self._receive_delayed_first_chunk(5.001)
        self.assertEqual(events, ['active'])
        # Stale DATA produces an error START/DATA rather than an ACK.
        self.assertEqual([message[4] for message in response], [2, 3])

        errors = Events()
        observer = pymidibridge.PyMidiBridge(Midi(), event_handler=errors)
        for message in response:
            observer.receive(message)
        self.assertEqual(len(errors.errors), 1)
        self.assertIn('Receive transmission', errors.errors[0])
        self.assertIn('not found', errors.errors[0])

    def test_exact_timeout_boundary_still_accepts_the_first_data_chunk(self):
        events, response = self._receive_delayed_first_chunk(5)
        self.assertEqual(events, ['stalled', 'active'])
        self.assertEqual([message[4] for message in response], [4])
