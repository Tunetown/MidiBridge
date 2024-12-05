
describe('Protocol', function() {

    it('Send/receive', async function() {
		const test = new TestProtocol();
		
		await test.testSendReceive(
            "foo",
            " ",
            2
        )

        // Ca. 180 bytes
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            2
        )

        // A bit over 2 kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            4
        )

        // ~ 5kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            6
        )
    });
});


class TestProtocol {	
	
	async testSendReceive(path, inputData, expectedNumMessages) {
        const bridge = new JsMidiBridge();
        
        bridge.callbacks.register("Test", "file.get", function(data) {
			if (data.path == path) {
				return inputData;	
			}
			if (data.path == "bar") {
				return "Hello";
			}						
		});
		
		let start_called = false;
		let finish_called = false;
		
		bridge.callbacks.register("Test", "receive.start", function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages);
			start_called = true					
		});

		let progressCnt = 0;
		bridge.callbacks.register("Test", "receive.progress", function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages);
			expect(data.data).toEqual(inputData);	
			expect(data.chunk).toBe(progressCnt++);						
		});

		bridge.callbacks.register("Test", "receive.finish", function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages);
			expect(data.data).toEqual(inputData);	
			finish_called = true					
		});
		
		let messagesSent = [];
		
		bridge.callbacks.register("Test", "midi.sysex.send", function(data) {
			expect(Array.isArray(data.manufacturerId)).toBe(true);
			expect(Array.isArray(data.data)).toBe(true);
			messagesSent.push(data);	
		});
        
        // Get a request message for the path
        await bridge.request(path);
        const msgRequest = messagesSent[0];

        // Get some messages related to another file
        messagesSent = [];
        await bridge.send("bar");
        const msgsOtherFile = messagesSent.slice();
        expect(msgsOtherFile.length).toBeGreaterThanOrEqual(2);

        messagesSent = []

        // Let the bridge receive a request message, to trigger it sending a file
        await bridge.receive(msgRequest);

        // Are amount of generated messages
        expect(messagesSent.length).toBe(expectedNumMessages);
        
        // Feed back the generated MIDI messages to the bridge, yielding the input data again
        let failureTestsDone = false;
        let cnt = 0;
        const msgs = messagesSent.slice();
        
        for (const msg of msgs) {
            messagesSent = [];

            await bridge.receive(msg);

            if (cnt == msgs.length - 1) {
                // Last message: Must have an ack message sent
                await this.#evaluateAck(messagesSent[messagesSent.length - 1]);
            }

            ++cnt;

            if (failureTestsDone) continue;
            
            // Put in some invalid messages too: Different manufacturer ID (no Exception)
            await bridge.receive(
                {
                    manufacturerId: [0x00, 0x01, 0x02],
                    data: [0x00, 0xac, 0xdc]
                }
            )

            // Null (no Exception)
            await bridge.receive(null);

            // Transmission errors: Change some byte (must return an error message)
            const invalidData = [];
            for (let i = 0; i < msg.data.length; ++i) {
				invalidData.push(i != 1 ? msg.data[i] : msg.data[i - 1])
			}
            
            await bridge.receive(
                {
                    manufacturerId: msg.manufacturerId,
                    data: invalidData
                }
            )
            await this.#evaluateError(messagesSent[messagesSent.length - 1], "Checksum");

            // Different file ID: Take a data message from the other file (no exception)
            await bridge.receive(msgsOtherFile[msgsOtherFile.length - 1]);

            // Invalid chunk index: Repeat first chunk (must issue an error message)
            await bridge.receive(this.#generateInvalidChunk(msg));
            await this.#evaluateError(messagesSent[messagesSent.length - 1], "Invalid chunk");

            failureTestsDone = true;
        }
        
        expect(start_called).toBe(true);
        expect(finish_called).toBe(true);   
        expect(progressCnt).toBe(expectedNumMessages);   
    }
    
    /**
	 * Generates an invalid chunk for the file_id in the passed message. The chunk 0 is used, because this is invalid after
	 */
    #generateInvalidChunk(midiMessage, invalidIndex = 999) {
        const bridge = new JsMidiBridge();

        const fileId = midiMessage.data.slice(4, 8);
        const chunkIndex = Array.from(bridge.number2bytes(invalidIndex, 3));
        const data = Array.from(bridge.string2bytes("foo"));

        const payload = fileId.concat(chunkIndex, data);
        const checksum = bridge.getChecksum(new Uint8Array(payload));

        return {
            manufacturerId: JMB_MANUFACTURER_ID,
            data: JMB_DATA_MESSAGE.concat(checksum, payload)
        }
    }

    /**
	 * Helper to check error messages
	 */
    async #evaluateError(midiMessage, token) {
		expect(midiMessage.manufacturerId).toEqual(JMB_MANUFACTURER_ID);
        expect(midiMessage.data.slice(0, 1), JMB_ERROR_MESSAGE);
        
        const bridge = new JsMidiBridge(); 

		let called = false;

		bridge.callbacks.register("Test", "error", function(data) {
			expect(data.message).toContain(token);
			called = true					
		});

        await bridge.receive(midiMessage);
        
        expect(called).toBe(true);
    }


    /**
	 * Helper to check ack messages
	 */
    async #evaluateAck(midiMessage) {
        expect(midiMessage.manufacturerId).toEqual(JMB_MANUFACTURER_ID);
        expect(midiMessage.data.slice(0, 1), JMB_ACK_MESSAGE);
        
        const bridge = new JsMidiBridge();    
        
        let called = false;

		bridge.callbacks.register("Test", "receive.ack", function() {
			called = true					
		});

        await bridge.receive(midiMessage)        
        
        expect(called).toBe(true);
    }
}

/*


  

    
        

    def test_receive_reboot(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(SystemExit):
            bridge.receive(
                MockSystemExclusiveMessage(
                    manufacturer_id = PMB_MANUFACTURER_ID,
                    data = PMB_REBOOT_MESSAGE
                )
            )

    
    def test_send_no_path(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.send(None)

        with self.assertRaises(Exception):
            bridge.send("")


    def test_request_file_not_found(self):
        midi = MockMidiSender()
        storage = MockStorageProvider()

        bridge = PyMidiBridge(
            midi = midi, 
            storage = storage
        )

        storage.outputs_size = {
            "foo": 5
        }

        storage.read_data = {
            "foo": "ghtgf"
        }

        bridge.request("foo")
        msg_request = midi.last_message

        bridge.receive(msg_request)
        
        storage.outputs_size["foo"] = -1

        bridge.receive(msg_request)
        self._evaluate_error(midi.last_message, "foo")
        self._evaluate_error(midi.last_message, "not found")


    def test_request_empty_file(self):
        midi = MockMidiSender()
        storage = MockStorageProvider()

        bridge = PyMidiBridge(
            midi = midi, 
            storage = storage
        )

        storage.outputs_size = {
            "foo": 0
        }

        storage.read_data = {
            "foo": ""
        }

        bridge.request("foo")
        msg_request = midi.last_message

        bridge.receive(msg_request)
        self._evaluate_error(midi.last_message, "foo")
        self._evaluate_error(midi.last_message, "empty")
        

############################################################################################################


    def test_request_file(self):
        self._test_request_file(" ")
        self._test_request_file("foo")
        self._test_request_file("/foo/path/to/bar.txt")


    def _test_request_file(self, path):
        midi = MockMidiSender()

        bridge = PyMidiBridge(
            midi = midi,
            storage = None
        )        
        
        bridge.request(path)

        msg_sent = messagesSent[0]
        self.assertEqual(msg_sent.manufacturer_id, PMB_MANUFACTURER_ID)
        self.assertEqual(msg_sent.data[:1], PMB_REQUEST_MESSAGE)

        checksum = msg_sent.data[1:4]
        payload = bridge._bytes_2_string(msg_sent.data[4:])
        
        self.assertEqual(payload, path)
        self.assertEqual(checksum, bridge._get_checksum(msg_sent.data[4:]))


    def test_request_no_path(self):
        bridge = PyMidiBridge(None, None)

        with self.assertRaises(Exception):
            bridge.request(None)

        with self.assertRaises(Exception):
            bridge.request("")


############################################################################################################


    def test_generate_file_id(self):
        bridge = PyMidiBridge(None, None)
        buffer = []

        for i in range(100):
            file_id = bridge._generate_file_id()

            self.assertEqual(len(file_id), 4)
            self.assertNotIn(file_id, buffer)

            buffer.append(file_id)            




*/

