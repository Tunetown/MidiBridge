
describe('Protocol (Timeout)', function() {

    beforeEach(() => {
        jasmine.clock().install();
    });
    
    afterEach(() => {
        jasmine.clock().uninstall();
    });
    
    it('Timeout (Receive)', async function() {
		const test = new TestProtocolTimeout();
        await test.testReceiveTimeout();
    });    

    it('Timeout (Send)', async function() {
		const test = new TestProtocolTimeout();
        await test.testSendTimeout();
    });    
});


class TestProtocolTimeout {	
	
	async testReceiveTimeout() {
        jasmine.clock().mockDate(new Date(1000));

        // Bridge for sending data
        const bridgeSend = new JsMidiBridge();
        
        bridgeSend.getFile = function(path_p) {
			if (path_p == "foo") {
				return "OllehCasklakldmcömpöosdpo sdvsdöv sdvsd vsdvgeg etrhtrhrt ret";
			}
			if (path_p == "bar") {
				return "Hello sdv wrpv wprvmevmkefv ö löevö wöorvömklfsdvnlsd dvsdvsdvsdvsssvsd";
			}						
		}
		
        // Bridge for receiving data
        const bridgeReceive = new JsMidiBridge();

		let finishCalls = [];
		
		bridgeReceive.onReceiveFinish = function(data) {
			finishCalls.push(data.data);
		}
		
		let messagesSentSend = [];
		bridgeSend.sendSysex = function(manufacturerId, data) {
			messagesSentSend.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}

        let messagesSentReceive = [];
		bridgeReceive.sendSysex = function(manufacturerId, data) {
			messagesSentReceive.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}	

        // Get a request message for the path from the receiving side
        await bridgeReceive.request("foo", 3);
        const msgRequestFoo = messagesSentReceive[0];
        messagesSentReceive = [];

        // Get a request message for the path from the receiving side
        await bridgeReceive.request("bar", 4);
        const msgRequestBar = messagesSentReceive[0];
        messagesSentReceive = [];

        // Let the bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequestFoo)).toBe(true);

        // Receive start message
        const startMsg1 = messagesSentSend.shift();
        const dataMsg1 = messagesSentSend.shift();
        expect(await bridgeReceive.receive(startMsg1)).toBe(true);
        expect(messagesSentReceive.length).toBe(0);

        // Receive data message
        expect(await bridgeReceive.receive(dataMsg1)).toBe(true);

        // Get next data message
        expect(messagesSentReceive.length).toBe(1);
        const ackMsg1 = messagesSentReceive.shift();
        expect(await bridgeSend.receive(ackMsg1)).toBe(true);
        const dataMsg1b = messagesSentSend.shift();        
        
        // Let pass some virtual time so the first transmission will timeout
        jasmine.clock().mockDate(new Date(1000 * 10));
        
        // Let the sending bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequestBar)).toBe(true);
        
        // Receive start message 
        const startMsg2 = messagesSentSend.shift();
        const dataMsg2 = messagesSentSend.shift();
        expect(await bridgeReceive.receive(startMsg2)).toBe(true);
        expect(messagesSentReceive.length).toBe(0);

        // Receive data message 2 (must raise "Transmission not found")
        expect(await bridgeReceive.receive(dataMsg1b)).toBe(true);

        await this.#evaluateError(bridgeReceive, messagesSentReceive, ["transmission", "not found"]);
    }

    async testSendTimeout() {
        jasmine.clock().mockDate(new Date(1000));

        // Bridge for sending data
        const bridgeSend = new JsMidiBridge();
        
        bridgeSend.getFile = function(path_p) {
			if (path_p == "foo") {
				return "OllehCasklakldmcömpöosdpo sdvsdöv sdvsd vsdvgeg etrhtrhrt ret";
			}
			if (path_p == "bar") {
				return "Hello sdv wrpv wprvmevmkefv ö löevö wöorvömklfsdvnlsd dvsdvsdvsdvsssvsd";
			}						
		}
		
        // Bridge for receiving data
        const bridgeReceive = new JsMidiBridge();

		let finishCalls = [];
		
		bridgeReceive.onReceiveFinish = function(data) {
			finishCalls.push(data.data);
		}
		
		let messagesSentSend = [];
		bridgeSend.sendSysex = function(manufacturerId, data) {
			messagesSentSend.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}

        let messagesSentReceive = [];
		bridgeReceive.sendSysex = function(manufacturerId, data) {
			messagesSentReceive.push({
                manufacturerId: manufacturerId,
                data: data
            });
		}	

        // Get a request message for the path from the receiving side
        await bridgeReceive.request("foo", 3);
        const msgRequestFoo = messagesSentReceive[0];
        messagesSentReceive = [];

        // Get a request message for the path from the receiving side
        await bridgeReceive.request("bar", 4);
        const msgRequestBar = messagesSentReceive[0];
        messagesSentReceive = [];

        // Let the bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequestFoo)).toBe(true);

        // Receive start message
        const startMsg1 = messagesSentSend.shift();
        const dataMsg1 = messagesSentSend.shift();
        expect(await bridgeReceive.receive(startMsg1)).toBe(true);
        expect(messagesSentReceive.length).toBe(0);

        // Receive data message
        expect(await bridgeReceive.receive(dataMsg1)).toBe(true);

        // Get next data message
        expect(messagesSentReceive.length).toBe(1);
        const ackMsg1 = messagesSentReceive.shift();
        
        // Let pass some virtual time so the first transmission will timeout
        jasmine.clock().mockDate(new Date(1000 * 10));
        
        // Let the sending bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequestBar)).toBe(true);
        
        messagesSentSend = [];
        expect(await bridgeSend.receive(ackMsg1)).toBe(true);

        await this.#evaluateError(bridgeSend, messagesSentSend, ["transmission", "not found"]);
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

