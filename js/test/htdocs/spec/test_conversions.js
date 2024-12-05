
describe('Conversions', function() {

    it('Pack/unpack bytes: Identity', function() {
		// Check some examples
        testPackUnpack([]);

        testPackUnpack([0]);
        testPackUnpack([1]);
        testPackUnpack([10]);
        testPackUnpack([255]);

        testPackUnpack([255, 0]);
        testPackUnpack([0, 255]);

        testPackUnpack([0, 127, 255]);
        testPackUnpack([255, 255, 255]);
        testPackUnpack([0, 0, 0]);
        testPackUnpack([127, 127, 127]);

        testPackUnpack([2, 0, 3, 4, 255, 200]);
        testPackUnpack([2, 0, 3, 4, 0]);
        testPackUnpack([2, 0, 3, 4, 255, 200, 222]);        
    });
    
    it('Pack/unpack bytes: Sizes', function() {
		// Check size of packed content
        const bridge = new JsMidiBridge(null, null);

        expect(bridge.packBytes(new Uint8Array([255])).length).toBe(2);
        expect(bridge.packBytes(new Uint8Array([255, 255])).length).toBe(3);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255])).length).toBe(4);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255, 255])).length).toBe(5);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255, 255, 255])).length).toBe(6);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255, 255, 255, 255])).length).toBe(7);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255, 255, 255, 255, 255])).length).toBe(8);
        expect(bridge.packBytes(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255])).length).toBe(10);
	});
	
	
	//##########################################################################################################


	it('String conversion: Identity', function() {
		testStringConversion("");
        testStringConversion(" ");
        testStringConversion("      ");

        testStringConversion("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"§$%&/()=?*+#-_.:,;<>^°`´");
        testStringConversion("äöüÖÄÜß");
	});
	
	
	//##########################################################################################################
	
	
	it('Number conversion: Identity', function() {
		for (let i=0; i<99; ++i) {
            testNumberConversion(i, 1, 2);
        }

        for (let i=0; i<256; ++i) {
            testNumberConversion(i, 2, 3);
		}
		
        for (let i=0; i<9999; i += 10) {
            testNumberConversion(i, 3, 4);
            testNumberConversion(i, 4, 5);
            
            // Note: JS does have problems shifting outside the 32bit border, so we do not support this here
            // (which is not problem as the bridge only needs 3 byte integers, but could be upped to 4 in the future) 
        }
	});
});


//##########################################################################################################


function testPackUnpack(data) {
    const bridge = new JsMidiBridge(null, null);
    
    data = new Uint8Array(data);
            
    const packed = bridge.packBytes(data);
    
    checkHalfBytes(packed);

    if (data.size > 0) {
        expect(data).not.toEqual(packed);
    }

    const unpacked = bridge.unpackBytes(packed);

	expect(unpacked).toEqual(data);
}


function checkHalfBytes(data) {
    expect(data).toBeInstanceOf(Uint8Array);
    
	for (const b of data) {
		expect(b).toBeGreaterThanOrEqual(0);
		expect(b).toBeLessThan(128);
    }
}

function testStringConversion(str) {
    const bridge = new JsMidiBridge(null, null);

    const encoded = bridge.string2bytes(str);
    
    checkHalfBytes(encoded);

    const decoded = bridge.bytes2string(encoded);

    expect(decoded).toEqual(str);
}

function testNumberConversion(value, numBytes, outputLen) {
    const bridge = new JsMidiBridge(null, null);

    const encoded = bridge.number2bytes(value, numBytes);

	expect(encoded.length).toBe(outputLen);
    checkHalfBytes(encoded);
    
    const decoded = bridge.bytes2number(encoded);

	expect(decoded).toBe(value);
}
