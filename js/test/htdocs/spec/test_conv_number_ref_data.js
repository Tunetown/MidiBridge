
describe('Number conversion (with reference data from the Python version)', function() {

    it('Compare', function() {
		const test = new TestNumberConversion();
		
		test.testAgainstRefData("pmb_numbers_4bytes.json");
		test.testAgainstRefData("pmb_numbers_6bytes.json");
    });
});


class TestNumberConversion {
	testAgainstRefData(fileName) {     
		const bridge = new JsMidiBridge();
		
		// Load messages
		const dataJson = TestDataHandler.get(fileName);
		
		const expNumbers = JSON.parse(dataJson);
		
		for (let i = 0; i < 10000; ++i) {
		    const data = new Uint8Array(expNumbers[i]);
		    
		    const converted = bridge.bytes2number(data);
		    
		    expect(converted).toBe(i);
	    }
	}   
}

