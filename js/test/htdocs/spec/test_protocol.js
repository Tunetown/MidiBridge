
describe('Protocol', function() {

    it('Send/receive', async function() {
		const test = new TestProtocol();
		
		await test.testSendReceive(
            "foo",
            " ",
            2,
            100
        )

        // Ca. 180 bytes
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            3,
            100
        )

        // A bit over 2 kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            11,
            256
        )

        // ~ 5kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            43,
            115
        )

        // Some UTF-8
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some UTF-8 content: €€~~{}[]¢[]",
            2,
            115
        )
    });
    
    
    it('Send: No path', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.sendFile(null)).toBeRejected();
	    await expectAsync(bridge.sendFile("")).toBeRejected();
	    await expectAsync(bridge.sendFile(false)).toBeRejected();	        		
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
		
		await test.testRequestFile(" ", 10);
        await test.testRequestFile("foo", 1);
        await test.testRequestFile("/foo/path/to/bar.txt", 5600);
    });
    
    it('Request: No path', async function() {
		const bridge = new JsMidiBridge();
		await expectAsync(bridge.request(null)).toBeRejected();
		await expectAsync(bridge.request("")).toBeRejected();
		await expectAsync(bridge.request(false)).toBeRejected();
	});	
	
	it('Request: Generate transmission ID', async function() {
		const bridge = new JsMidiBridge();
        const buffer = [];

        for (let i = 0; i < 100; ++i) {
            const transmissionId = bridge.generateTransmissionId();

            expect(transmissionId).toBeInstanceOf(Uint8Array);
            expect(transmissionId.length).toBe(4);

            buffer.push(transmissionId);
        }         
	});	
});


class TestProtocol {	
	
	async testSendReceive(path, inputData, expectedNumMessages, chunkSize) {
        const bridge = new JsMidiBridge();
        
        bridge.getFile = function(path_p) {
			if (path_p == path) {
				return inputData;	
			}
			if (path_p == "bar") {
				return "Hello";
			}						
		}
		
		let start_called = false;
		let finish_called = false;
		
		bridge.onReceiveStart = function(data) {
			expect(data.path).toEqual(path);			
			
			expect(data.numChunks).toBe(expectedNumMessages - 1);
			start_called = true					
		}

		let progressCnt = 0;
		bridge.onReceiveProgress = function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages - 1);
			expect(data.chunk).toBe(progressCnt++);						
		}

		bridge.onReceiveFinish = function(data) {
			expect(data.path).toEqual(path);
			expect(data.numChunks).toBe(expectedNumMessages - 1);
			expect(data.data).toEqual(inputData);	
			finish_called = true					
		}
		
		let messagesSent = [];
		
		bridge.sendSysex = function(manufacturerId, data) {
			expect(Array.isArray(manufacturerId)).toBe(true);
			expect(Array.isArray(data)).toBe(true);

			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}
        
        // Get a request message for the path
        await bridge.request(path, chunkSize);
        const msgRequest = messagesSent[0];

        // Get some messages related to another file
        messagesSent = [];
        
        await bridge.sendFile("bar", 20);
        const msgsOtherFile = messagesSent.slice();
        
        expect(msgsOtherFile.length).toBeGreaterThanOrEqual(2);

        messagesSent = []

        // Let the bridge receive a request message, to trigger it sending a file
        expect(await bridge.receive(msgRequest)).toBe(true);

        // Are amount of generated messages
        expect(messagesSent.length).toBe(expectedNumMessages);

        for(const msg of messagesSent) {
            expect(msg.data.length).toBeLessThanOrEqual(chunkSize * 2 + 8);
        }
        
        // Feed back the generated MIDI messages to the bridge, yielding the input data again
        let failureTestsDone = false;
        let cnt = 0;
        const msgs = messagesSent.slice();
        
        for (const msg of msgs) {
            messagesSent = [];

            expect(await bridge.receive(msg)).toBe(true);

            if (cnt == msgs.length - 1) {
                // Last message: Must have an ack message sent
                await this.#evaluateAck(messagesSent[messagesSent.length - 1]);
            }

            ++cnt;

            if (failureTestsDone) continue;
            
            // Put in some invalid messages too: Different manufacturer ID (no Exception)
            expect(
                await bridge.receive(
                    {
                        manufacturerId: [0x00, 0x01, 0x02],
                        data: [0x00, 0xac, 0xdc]
                    }
                )
            ).toBe(false);

            // Null (no Exception)
            expect(await bridge.receive(null)).toBe(false);

            // Transmission errors: Change some byte (must return an error message)
            messagesSent = [];
            const invalidData = [];
            for (let i = 0; i < msg.data.length; ++i) {
				invalidData.push(i != 1 ? msg.data[i] : msg.data[i - 1])
			}
            
            expect(
                await bridge.receive(
                    {
                        manufacturerId: msg.manufacturerId,
                        data: invalidData
                    }
                )
            ).toBe(true);
            await this.#evaluateError(messagesSent, "Checksum");

            // Different file ID: Take a data message from the other file (no exception)
            expect(await bridge.receive(msgsOtherFile[msgsOtherFile.length - 1])).toBe(true);

            // Invalid chunk index: Repeat first chunk (must issue an error message)
            messagesSent = [];
            expect(await bridge.receive(this.#generateInvalidChunk(msg))).toBe(true);
            await this.#evaluateError(messagesSent, "Invalid chunk");

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
    async #evaluateError(midiMessages, token) {        
        const bridge = new JsMidiBridge(); 

		let called = false;

		bridge.onError = function(message) {
			expect(message).toContain(token);
			called = true					
		}
        
        for (const msg of midiMessages) {
            expect(await bridge.receive(msg)).toBe(true);
        }
        
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

		bridge.onReceiveAck = function(data) {
			called = true					
		}

        expect(await bridge.receive(midiMessage)).toBe(true);
        
        expect(called).toBe(true);
    }
    
    
    //###############################################################################################
    
    
    async testFileNotFound() {
    	const bridge = new JsMidiBridge();
		
   		let messagesSent = [];
		let returnNull = false;
		
		bridge.getFile = function(path) {
			if (returnNull) {
				return null;
			}
			if (path == "foo") {
				return "ghtgf";
			}
		}
		
		bridge.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });	
		}

        await bridge.request("foo", 20);
        const msgRequest = messagesSent[0];

		messagesSent = [];
        returnNull = true;

        expect(await bridge.receive(msgRequest)).toBe(true);
        
        await this.#evaluateError(messagesSent, "foo");
        await this.#evaluateError(messagesSent, "not found");
    }
    
    async testEmptyFile() {
        const bridge = new JsMidiBridge();
        
        let messagesSent = [];

		bridge.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });	
		}

		bridge.getFile = function(path) {
			if (path == "foo") {
				return null;
			}
		}

        await bridge.request("foo", 20);
        const msgRequest = messagesSent[0];

        messagesSent = [];        
        
        expect(await bridge.receive(msgRequest)).toBe(true);
        
        await this.#evaluateError(messagesSent, "foo");
        await this.#evaluateError(messagesSent, "empty");
    }


	//###############################################################################################


    async testRequestFile(expPath, expChunkSize) {
       	const bridge = new JsMidiBridge();    
        
        let messagesSent = [];

		bridge.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });	
		}
		
        await bridge.request(expPath, expChunkSize);

        const msgSent = messagesSent[0];
        
        expect(msgSent.manufacturerId).toEqual(JMB_MANUFACTURER_ID);
        expect(msgSent.data.slice(0, 1), JMB_REQUEST_MESSAGE);
        
        const checksum = new Uint8Array(msgSent.data.slice(1, 4));
        const chunkSize = bridge.bytes2number(new Uint8Array(msgSent.data.slice(4, 8)));
        const path = bridge.bytes2string(new Uint8Array(msgSent.data.slice(8)));
        
        expect(path).toEqual(expPath);
        expect(chunkSize).toEqual(expChunkSize);
        expect(checksum).toEqual(bridge.getChecksum(new Uint8Array(msgSent.data.slice(4))));
    }
}

