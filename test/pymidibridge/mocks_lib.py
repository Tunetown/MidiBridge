
class MockAdafruitMIDISystemExclusive:    
    class SystemExclusive:
        def __init__(self, manufacturer_id = [0x00, 0x00, 0x00], data = []):
            self.manufacturer_id = manufacturer_id
            self.data = data


class MockMidi:
    def __init__(self):
        self.messages_sent = []

    def send(self, midi_message):
        self.messages_sent.append(midi_message)


class MockOs:
        
    RENAME_CALLS = []

    def rename(source, target):
        MockOs.RENAME_CALLS.append({
            "source": source,
            "target": target
        })


class MockWriter:
    def __init__(self):
        self.contents = ""

    def write(self, data):
        self.contents += data

