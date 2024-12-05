
describe('Checksum', function() {

    it('Collisions', function() {
		const test = new TestChecksumCollisions();
		
		for (length = 10; length <= 1000; length += 200) {
            test.testCollisions(length);
        }
    });
    
    it('No input data', function() {
		const bridge = new JsMidiBridge();
		
		expect(bridge.getChecksum(new Uint8Array())).toEqual(new Uint8Array([0, 0, 0]));
    });
    
    
});

class TestChecksumCollisions {
	testCollisions(length) {
		const bridge = new JsMidiBridge();
		
		const data = this.generateData(length);
		expect(data.length).toBe(length);
		
		const checksum = bridge.getChecksum(data);
		
		expect(checksum).toBeInstanceOf(Uint8Array);
		expect(checksum.length).toBe(3);
		
		// Change bits
		for (let i = 2; i < length; i += 5) {
		    const changedList = data.slice();
		    if (changedList[i] < 127) {
		        changedList[i] += 1;
		    } else {
		        changedList[i] -= 1;
	        }
		
		    const checksumChanged =  bridge.getChecksum(changedList);
		
			expect(checksum).not.toEqual(checksumChanged);
		}
	}
	
	generateData(length) {
		const ret = [];
		for (let i = 0; i < length; ++i) {
			ret.push(i % 256);
		}
		return new Uint8Array(ret);
	}	
}
