
describe('Checksum', function() {

    it('Collisions', function() {
		for (length = 10; length <= 1000; length += 200) {
            testCollisions(length);
        }
    });
    
    it('No input data', function() {
		const bridge = new JsMidiBridge(null, null);
		
		expect(bridge.getChecksum(new Uint8Array())).toEqual(new Uint8Array([0, 0, 0]));
    });
    
    
});

function testCollisions(length) {
	const bridge = new JsMidiBridge(null, null);
	
	const data = generateData(length);
	expect(data.length).toBe(length);
	
	const checksum = bridge.getChecksum(data);
	
	expect(checksum).toBeInstanceOf(Uint8Array);
	expect(checksum.length).toBe(3);
	
	// Change bits
	for (i = 2; i < length; i += 5) {
	    const changed_list = data.slice();
	    if (changed_list[i] < 127) {
	        changed_list[i] += 1;
	    } else {
	        changed_list[i] -= 1;
        }
	
	    const checksum_changed =  bridge.getChecksum(changed_list);
	
		expect(checksum).not.toEqual(checksum_changed);
	}
}

function generateData(length) {
	ret = [];
	for (i = 0; i < length; ++i) {
		ret.push(i % 256);
	}
	return new Uint8Array(ret);
}

/*



   

    def test_no_data(self):
       

 */