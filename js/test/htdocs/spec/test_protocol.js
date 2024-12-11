
describe('Protocol', function() {

    it('Send/receive', async function() {
		const test = new TestProtocol();
		
		await test.testSendReceive(
            "foo",
            " ",
            100
        )

        // Ca. 180 bytes
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "| Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            100
        )

        // A bit over 2 kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            256
        )

        // ~ 5kB
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<> | Some foo file content \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS   nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSiojnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS  nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSuiuint \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSnt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS nt \n with newlines \n etc.pp and Umlauts äöü \n acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°^!\\2§$%&/()=ß?´`+*#'-_.:,;<>",
            115
        )

        // Some UTF-8
        await test.testSendReceive(
            "/foo/path/to/bar.txt",
            "Some UTF-8 content: €€~~{}[]¢[]",
            115
        )
    });
    
    it('Receive: Invalid data', async function() {
        const test = new TestProtocol();
        await test.testReceiveInvalidData();
    });

    it('Receive: Invalid checksum', async function() {
        const test = new TestProtocol();
        await test.testReceiveInvalidChecksum();
    });

    it('Receive: Invalid transmission', async function() {
        const test = new TestProtocol();
        await test.testReceiveInvalidTransmission();
    });

    it('Receive: Invalid chunk', async function() {
        const test = new TestProtocol();
        await test.testReceiveInvalidChunk();
    });

    it('Send: No path', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.sendFile(null)).toBeRejected();
	    await expectAsync(bridge.sendFile("")).toBeRejected();
	    await expectAsync(bridge.sendFile(false)).toBeRejected();	        		
	});	
	
    it('Send File: Invalid chunk size', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.sendFile("foo", 0)).toBeRejected();
	    await expectAsync(bridge.sendFile("foo", -1)).toBeRejected();
	});	
	
	it('Send String: Invalid chunk size', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.sendString("foo", "msg", 0)).toBeRejected();
	    await expectAsync(bridge.sendString("foo", "msg", -1)).toBeRejected();
	});	
	
	it('Send String: No message', async function() {
		const bridge = new JsMidiBridge();
	    	    
	    await expectAsync(bridge.sendString("foo", null, 20)).toBeRejected();
	    await expectAsync(bridge.sendString("foo", "", 20)).toBeRejected();
        await expectAsync(bridge.sendString("foo", false, 20)).toBeRejected();
	});	
	
	it('Request: File not found', async function() {
		const test = new TestProtocol();
		await test.testRequestFileNotFound();
	});		

	it('Request: Empty file', async function() {
		const test = new TestProtocol();
		await test.testRequestEmptyFile();
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
	
	async testSendReceive(path, inputData, chunkSize) {
        // Bridge for sending data
        const bridgeSend = new JsMidiBridge();
        
        bridgeSend.getFile = function(path_p) {
			if (path_p == path) {
				return inputData;	
			}
			if (path_p == "bar") {
				return "Hello";
			}						
		}
		
        // Bridge for receiving data
        const bridgeReceive = new JsMidiBridge();

		let startCalled = false;
		let finishCalled = false;
		
		bridgeReceive.onReceiveStart = function(data) {
			expect(data.path).toEqual(path);			
			startCalled = true;	
		}

		let progressCnt = 0;
		bridgeReceive.onReceiveProgress = function(data) {
			expect(data.path).toEqual(path);
			expect(data.chunk).toBe(progressCnt++);						
		}

		bridgeReceive.onReceiveFinish = function(data) {
			expect(data.path).toEqual(path);
			expect(data.data).toEqual(inputData);	
			finishCalled = true;
		}
		
		let messagesSentSend = [];
		bridgeSend.sendSysex = function(manufacturerId, data) {
			expect(Array.isArray(manufacturerId)).toBe(true);
			expect(Array.isArray(data)).toBe(true);

			messagesSentSend.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}

        let messagesSentReceive = [];
		bridgeReceive.sendSysex = function(manufacturerId, data) {
			expect(Array.isArray(manufacturerId)).toBe(true);
			expect(Array.isArray(data)).toBe(true);

			messagesSentReceive.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		
        
        // Get a request message for the path from the receiving side
        await bridgeReceive.request(path, chunkSize);
        const msgRequest = messagesSentReceive[0];
        messagesSentReceive = [];
        
        // Let the bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequest)).toBe(true);

        expect(messagesSentSend.length).toBe(2);

        // Receive start message (no ack)        
        expect(await bridgeReceive.receive(messagesSentSend.shift())).toBe(true);
        expect(messagesSentReceive.length).toBe(0);
        
        // Helper to check ack messages
        function evaluateAck(midiMessage, expChunkIndex) {
            expect(midiMessage.manufacturerId).toEqual(JMB_MANUFACTURER_ID);
            expect(midiMessage.data.slice(0, 1)).toEqual(JMB_ACK_MESSAGE);

            const bridge = new JsMidiBridge();

            const checksum = midiMessage.data.slice(1, 4);
            const chunkSize = bridge.bytes2number(new Uint8Array(midiMessage.data.slice(8, 12)));

            expect(checksum).toEqual(Array.from(bridge.getChecksum(new Uint8Array(midiMessage.data.slice(4)))));
            expect(chunkSize).toBe(expChunkIndex);
        }

        // Feed back the generated MIDI messages to the bridge, yielding the input data again
        let chunkIndex = 0;
        while(true) {
            // Get next data message
            const msg = messagesSentSend.shift();
            expect(msg.data.length).toBeLessThanOrEqual(chunkSize * 2 + 8);

            // Feed data message to the receiving bridge (which must answer with ack)
            expect(await bridgeReceive.receive(msg)).toBe(true);

            expect(messagesSentReceive.length).toBe(1);
            const ackMsg = messagesSentReceive.shift();
            evaluateAck(ackMsg, chunkIndex);

            // Feed the ack message back to the sender bridge to get the next data message
            expect(await bridgeSend.receive(ackMsg)).toBe(true);
            
            if (messagesSentSend.length == 0) {
                // No further data
                break;
            }

            // There must be exactly 1 data message
            expect(messagesSentSend.length).toBe(1);

            chunkIndex += 1;
        }           
        
        // Be sure the results have been checked
        expect(startCalled).toBe(true);
        expect(finishCalled).toBe(true);           
    }    
    

    async testReceiveInvalidData() {
        const bridge = new JsMidiBridge();

        let messagesSent = [];
	    bridge.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		

        // Put in some invalid messages too: Different manufacturer ID (no Exception)
        expect(
            await bridge.receive({
                manufacturerId: [0x00, 0x01, 0x02],
                data: [0x00, 0xac, 0xdc]
            })
        ).toBe(false);

        expect(messagesSent.length).toBe(0);

        // None (no Exception)
        expect(await bridge.receive(null)).toBe(false);

        expect(messagesSent.length).toBe(0);

        // Other object (no Exception)
        expect(await bridge.receive(this)).toBe(false);

        expect(messagesSent.length).toBe(0);
    }


    async testReceiveInvalidChecksum() {
        const bridge = new JsMidiBridge();

        let messagesSent = [];
	    bridge.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		

        bridge.getFile = function(path_p) {
			if (path_p == "foo") {
				return "Hello";
			}						
		}

        // Get a request message for the path
        await bridge.request("foo", 20);
        const msgRequest = messagesSent[0];
        messagesSent = [];

        // Transmission errors: Change some byte (must return an error message)
        const invalidData = [];
        for (let i = 0; i < msgRequest.data.length; ++i) {
            invalidData.push(i != 1 ? msgRequest.data[i] : msgRequest.data[i - 1])
        }

        expect(
            await bridge.receive({
                manufacturerId: msgRequest.manufacturerId,
                data: invalidData
            })
        ).toBe(true); 

       await this.#evaluateError(bridge, messagesSent, ["Checksum"]);
    }


    async testReceiveInvalidTransmission() {
        // Bridge for sending data
        const bridgeSend = new JsMidiBridge();

        let messagesSent = [];
	    bridgeSend.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		

        bridgeSend.getFile = function(path_p) {
			if (path_p == "foo") {
				return "Hello";
			}						
		}

        // Bridge for sending other data
        const bridgeSend2 = new JsMidiBridge();

        let messagesSent2 = [];
	    bridgeSend2.sendSysex = function(manufacturerId, data) {
			messagesSent2.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		

        bridgeSend2.getFile = function(path_p) {
			if (path_p == "foo") {
				return "Hello";
			}						
		}

        // Bridge for receiving data
        const bridgeReceive = new JsMidiBridge();

        let messagesSentReceive = [];
	    bridgeReceive.sendSysex = function(manufacturerId, data) {
			messagesSentReceive.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}	

        // Main transmission
        await bridgeSend.sendFile("foo", 20);
        expect(messagesSent.length).toBe(2);

        // Other transmission
        await bridgeSend2.sendFile("foo", 20);
        expect(messagesSent2.length).toBe(2);

        // Start message for main transmission
        await bridgeReceive.receive(messagesSent.shift());

        // Data message of another transmission
        await bridgeReceive.receive(messagesSent2.pop())

        await this.#evaluateError(bridgeSend, messagesSentReceive, ["Transmission", "not found"]);
    }

    async testReceiveInvalidChunk() {
        // Bridge for sending data
        const bridgeSend = new JsMidiBridge();

        let messagesSent = [];
	    bridgeSend.sendSysex = function(manufacturerId, data) {
			messagesSent.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}		

        bridgeSend.getFile = function(path_p) {
			if (path_p == "foo") {
				return "HelloHelloHelloHelloHelloHelloHelloHelloHelloHello"
			}						
		}
        
        // Bridge for receiving data
        const bridgeReceive = new JsMidiBridge();

        let messagesSentReceive = [];
	    bridgeReceive.sendSysex = function(manufacturerId, data) {
			messagesSentReceive.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}	

        // Main transmission
        await bridgeSend.sendFile("foo", 5);
        expect(messagesSent.length).toBe(2);

        // Start message for main transmission
        await bridgeReceive.receive(messagesSent.shift());

        // Data message #1
        await bridgeReceive.receive(messagesSent.shift());
        
        // Ack message #1
        expect(messagesSent.length).toBe(0);
        expect(messagesSentReceive.length).toBe(1);
        
        await bridgeSend.receive(messagesSentReceive.shift());

        expect(messagesSent.length).toBe(1);

        // Data message #2
        const dataMessage2 = messagesSent.shift();
        await bridgeReceive.receive(dataMessage2);
        
        // Ack message #2
        expect(messagesSent.length).toBe(0);
        expect(messagesSentReceive.length).toBe(1);

        await bridgeSend.receive(messagesSentReceive.shift());

        expect(messagesSent.length).toBe(1);

        // Data message #2 again (invalid!)
        await bridgeReceive.receive(dataMessage2);
        
        await this.#evaluateError(bridgeSend, messagesSentReceive, ["Invalid", "chunk"]);
    }


    //###############################################################################################
    
    
    async testRequestFileNotFound() {
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
        
        await this.#evaluateError(bridge, messagesSent, ["foo", "not found"]);
    }
    

    async testRequestEmptyFile() {
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
        
        await this.#evaluateError(bridge, messagesSent, ["foo", "empty"]);
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


    //###############################################################################################


    /**
	 * Helper to check error messages
	 */
    async #evaluateError(bridge, messagesSent, tokens) {
        expect(messagesSent.length).toBe(2);

        const otherBridge = new JsMidiBridge(); 

		let called = false;

		otherBridge.onError = function(message) {
            for(const token of tokens) {
                expect(message).toContain(token);
            }
			
			called = true					
		}

        let messagesSentOther = [];
		otherBridge.sendSysex = function(manufacturerId, data) {
			messagesSentOther.push({
                manufacturerId: manufacturerId,
                data: data
            });	
		}
                
        while(true) {
            if (messagesSent.length == 0) {
                break;
            }                

            const msg = messagesSent.shift();
            
            expect(await otherBridge.receive(msg)).toBe(true);

            while (messagesSentOther.length > 0) {
                await bridge.receive(messagesSentOther.shift());
            }
        }

        expect(called).toBe(true);
    }
}

