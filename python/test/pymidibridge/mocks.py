import traceback 

class MockOs:
    stat_outputs = {}
    stat_exception = None
    rename_calls = []
    listdir_outputs = {}

    def stat(path):
        if MockOs.stat_exception:
            raise MockOs.stat_exception
        
        if path in MockOs.stat_outputs:
            return MockOs.stat_outputs[path]
        
        raise Exception()
        
    def rename(src, tar):
        MockOs.rename_calls.append({
            "source": src,
            "target": tar
        })

    def listdir(path):
        if path in MockOs.listdir_outputs:
            return MockOs.listdir_outputs[path]
        
        raise Exception()


class MockTime:
    monotonic_return = 0
    sleep_calls = []

    def monotonic():
        return MockTime.monotonic_return
    
    def sleep(amount):
        MockTime.sleep_calls.append(amount)


class MockSystemExclusiveMessage:
    def __init__(self, manufacturer_id = bytes([]), data = bytes([])):
        self.manufacturer_id = bytes(manufacturer_id)
        self.data = bytes(data)

    def __repr__(self):
        return repr([list(self.manufacturer_id), list(self.data)])


class MockMidiSender:
    def __init__(self, serializable = False):
        self.messages_sent = []
        self.messages_all = []
        self._serializable = serializable

    def send_system_exclusive(self, manufacturer_id, data):
        if self._serializable:
            # Use serializable representation
            obj = {
                "manufacturerId": list(manufacturer_id),
                "data": list(data)
            }
        else:
            obj = MockSystemExclusiveMessage(
                manufacturer_id = manufacturer_id,
                data = data
            )

        self.messages_sent.append(obj)
        self.messages_all.append(obj)

    @property
    def last_message(self):
        return self.messages_sent[len(self.messages_sent) - 1] if self.messages_sent else None


class MockFileHandle:
    def __init__(self, path, mode, read_contents = ""):
        self.path = path
        self.mode = mode
        self.read_contents = read_contents
        self.write_contents = ""
        self.closed = False

    def __repr__(self):
        return repr([self.path, self.mode])

    def read(self, amount_bytes):
        if self.closed:
            raise Exception("Mock file closed: " + repr(self.path))
        
        if self.mode != "r":
            raise Exception("Mock file not opened for reading: " + repr(self.path))

        if len(self.read_contents) > amount_bytes:
            ret = self.read_contents[:amount_bytes]
            self.read_contents = self.read_contents[amount_bytes:]
            return ret
        else:
            ret = self.read_contents
            self.read_contents = ""
            return ret
        
    def write(self, data):
        if self.closed:
            raise Exception("Mock file closed: " + repr(self.path))
        
        if self.mode != "a":
            raise Exception("Mock file not opened for appending: " + repr(self.path))

        self.write_contents += data

    def close(self):
        self.closed = True

        
class MockStorageProvider:

    def __init__(self):
        self.open_calls = []
        self.outputs_size = {}
        self.read_data = {}        
        self.created_handles = []

    def open(self, path, mode):
        ret = MockFileHandle(
            path = path,
            mode = mode,
            read_contents = self.read_data[path] if path in self.read_data else ""
        )

        self.created_handles.append(ret)
        
        return ret

    def size(self, path):
        return self.outputs_size[path] if path in self.outputs_size else 0


def get_mock_storage_factory(provider = None):
    if not provider:
        provider = MockStorageProvider()
    
    def sf():
        return provider
        
    return sf


class MockEventHandler:
    def __init__(self):
        self.last_error = None
        self.last_ack = None

    def handle(self, msg):
        self.last_error = msg

    def transfer_finished(self, path):
        self.last_ack = path

    def get_trace(self, exception):
        return "\n".join(traceback.format_exception(None, exception, exception.__traceback__))
    

class MockMidiController:
    def __init__(self):
        self.messages_sent = []
        self.next_receive_messages = []

    def receive(self):
        if self.next_receive_messages:
            return self.next_receive_messages.pop(0)
        
        return None
    
    def send(self, midi_message):
        self.messages_sent.append(midi_message)


class MockAdafruitMIDISystemExclusive:    
    class SystemExclusive:
        def __init__(self, manufacturer_id = [0x00, 0x00, 0x00], data = []):
            self.manufacturer_id = manufacturer_id
            self.data = data


class MockBridge:
    def __init__(self):
        self.receive_calls = []
        self.receive_outputs = {}

    def receive(self, msg):
        self.receive_calls.append(msg)

        if msg in self.receive_outputs:
            return self.receive_outputs[msg]