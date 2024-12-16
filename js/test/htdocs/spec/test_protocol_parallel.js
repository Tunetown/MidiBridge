
describe('Protocol (Parallel Transfer)', function() {

    it('Send/receive of parallel transmissions', async function() {
		const test = new TestProtocolParallel();
        await test.testSendReceiveParallel();
    });    
});


class TestProtocolParallel {	
	
	async testSendReceiveParallel() {
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

        // Let the bridge receive a request message, to trigger it sending a file
        expect(await bridgeSend.receive(msgRequestBar)).toBe(true);

        // Receive start message
        const startMsg2 = messagesSentSend.shift();
        const dataMsg2 = messagesSentSend.shift();
        expect(await bridgeReceive.receive(startMsg2)).toBe(true);
        expect(messagesSentReceive.length).toBe(0);

        expect(await bridgeReceive.receive(startMsg2)).toBe(true);

        // Receive data messages
        expect(await bridgeReceive.receive(dataMsg2)).toBe(true);
        expect(await bridgeReceive.receive(dataMsg1)).toBe(true);

        expect(messagesSentReceive.length).toBe(2);
        const ackMsg2 = messagesSentReceive.shift();
        const ackMsg1 = messagesSentReceive.shift();
        expect(await bridgeSend.receive(ackMsg1)).toBe(true);
        expect(await bridgeSend.receive(ackMsg2)).toBe(true);

        // Feed back the generated MIDI messages to the bridge, yielding the input data again
        while(true) {
            if (messagesSentSend.length == 0) {
                // No further data
                break;
            }
            // Get next data message
            const msg = messagesSentSend.shift();

            // Feed data message to the receiving bridge (which must answer with ack)
            expect(await bridgeReceive.receive(msg)).toBe(true);

            expect(messagesSentReceive.length).toBe(1);
            const ackMsg = messagesSentReceive.shift();

            // Feed the ack message back to the sender bridge to get the next data message
            expect(await bridgeSend.receive(ackMsg)).toBe(true);
        }           

        // Be sure the results have been checked
        expect(finishCalls).toEqual(
            [                
                "Hello sdv wrpv wprvmevmkefv ö löevö wöorvömklfsdvnlsd dvsdvsdvsdvsssvsd",
                "OllehCasklakldmcömpöosdpo sdvsdöv sdvsd vsdvgeg etrhtrhrt ret"
            ]
        );
    }
}

