
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
    
    
    it('Send: No path', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.send(null)).toBeRejected();
	    await expectAsync(bridge.send("")).toBeRejected();
	    await expectAsync(bridge.send(false)).toBeRejected();	        		
	});	
	
	
	it('Send: File not found', async function() {
		const test = new TestProtocol();
		await test.testFileNotFound();
	});		


	it('Send: Empty file', async function() {
		const test = new TestProtocol();
		await test.testEmptyFile();
	});		
	
	it('Request', async function() {
		const test = new TestProtocol();
		
		await test.testRequestFile(" ");
        await test.testRequestFile("foo");
        await test.testRequestFile("/foo/path/to/bar.txt");
    });
    
    it('Request: No path', async function() {
		const bridge = new JsMidiBridge();
		await expectAsync(bridge.request(null)).toBeRejected();
		await expectAsync(bridge.request("")).toBeRejected();
		await expectAsync(bridge.request(false)).toBeRejected();
	});	
	
	it('Request: Generate file ID', async function() {
		const bridge = new JsMidiBridge();
        const buffer = [];

        for (let i = 0; i < 100; ++i) {
            const fileId = bridge.generateFileId();

            expect(fileId).toBeInstanceOf(Uint8Array);
            expect(fileId.length).toBe(4);

            buffer.push(fileId);
        }         
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
			
			expect(data.numChunks).toBe(expectedNumMessages - 1);
			start_called = true					
		});

		let progressCnt = 0;
		bridge.callbacks.register("Test", "receive.progress", function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages - 1);
			expect(data.chunk).toBe(progressCnt++);						
		});

		bridge.callbacks.register("Test", "receive.finish", function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages - 1);
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
        expect(progressCnt).toBe(expectedNumMessages - 1);   
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
        const checksum = Array.from(bridge.getChecksum(new Uint8Array(payload)));

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
			if(!data.message.includes(token)) debugger;
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
    
    
    //###############################################################################################
    
    
    async testFileNotFound() {
    	const bridge = new JsMidiBridge();
		
   		let messagesSent = [];
		let returnNull = false;
		
		bridge.callbacks.register("Test", "file.get", function(data) {
			if (returnNull) {
				return null;
			}
			if (data.path == "foo") {
				return "ghtgf";
			}
		});
		
		bridge.callbacks.register("Test", "midi.sysex.send", function(data) {
			messagesSent.push(data);	
		});

        await bridge.request("foo");
        const msgRequest = messagesSent[0];

		messagesSent = [];
        returnNull = true;

        await bridge.receive(msgRequest);
        
        const lastMessage = messagesSent[messagesSent.length - 1];
        
        await this.#evaluateError(lastMessage, "foo");
        await this.#evaluateError(lastMessage, "not found");
    }
    
    async testEmptyFile() {
        const bridge = new JsMidiBridge();
        
        let messagesSent = [];

		bridge.callbacks.register("Test", "midi.sysex.send", function(data) {
			messagesSent.push(data);	
		});

		bridge.callbacks.register("Test", "file.get", function(data) {
			if (data.path == "foo") {
				return "";
			}
		});

        await bridge.request("foo");
        const msgRequest = messagesSent[0];

        await bridge.receive(msgRequest);
                
		const lastMessage = messagesSent[messagesSent.length - 1];
        
        await this.#evaluateError(lastMessage, "foo");
        await this.#evaluateError(lastMessage, "empty");
    }


	//###############################################################################################


    async testRequestFile(path) {
       	const bridge = new JsMidiBridge();    
        
        let messagesSent = [];

		bridge.callbacks.register("Test", "midi.sysex.send", function(data) {
			messagesSent.push(data);	
		});
		
        await bridge.request(path);

        const msgSent = messagesSent[0];
        
        expect(msgSent.manufacturerId).toEqual(JMB_MANUFACTURER_ID);
        expect(msgSent.data.slice(0, 1), JMB_REQUEST_MESSAGE);
        
        const checksum = new Uint8Array(msgSent.data.slice(1, 4));
        const payload = bridge.bytes2string(new Uint8Array(msgSent.data.slice(4)));
        
        expect(payload).toEqual(path);
        expect(checksum).toEqual(bridge.getChecksum(new Uint8Array(msgSent.data.slice(4))));
    }
}

