
class MockSystemExclusiveMessage:
    def __init__(self, manufacturer_id = bytes([]), data = bytes([])):
        self.manufacturer_id = bytes(manufacturer_id)
        self.data = bytes(data)

    def __repr__(self):
        return repr([list(self.manufacturer_id), list(self.data)])


class MockMidiSender:
    def __init__(self, serializable = False):
        self.messages_sent = []
        self._serializable = serializable

    def send_system_exclusive(self, manufacturer_id, data):
        if self._serializable:
            # Use serializable representation
            self.messages_sent.append({
                "manufacturerId": list(manufacturer_id),
                "data": list(data)
            })
        else:
            self.messages_sent.append(
                MockSystemExclusiveMessage(
                    manufacturer_id = manufacturer_id,
                    data = data
                )
            )

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


class MockEventHandler:
    def __init__(self):
        self.last_error = None
        self.last_ack = None

    def handle(self, msg):
        self.last_error = msg

    def transfer_finished(self, path):
        self.last_ack = path