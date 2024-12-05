
describe('Checksum (with reference data from the Python version)', function() {

    it('Compare', function() {
		const test = new TestChecksumRefData();
		
		test.testAgainstRefData(
            file_path = "pmb_checksum_1.json",
            data = [0]
        )

        test.testAgainstRefData(
            file_path = "pmb_checksum_2.json",
            data = [0xff, 0xab, 0x77, 0x6c, 0x99, 0x00, 0x00, 0x00, 0x66]
        )

        test.testAgainstRefData(
            file_path = "pmb_checksum_3.json",
            data = [0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff]
        )

        test.testAgainstRefData(
            file_path = "pmb_checksum_4.json",
            data = [0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff]
        )

        test.testAgainstRefData(
            file_path = "pmb_checksum_5.json",
            data = [0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x66, 0x77, 0x88, 0x99, 0xac, 0xdc, 0xa4, 0x52, 0x87, 0x98, 0x09, 0x90, 0x65, 0x4e, 0x3e, 0xe3, 0x2a, 0x6e, 0xff, 0xff, 0x99]
        )
    });
});


class TestChecksumRefData {
	testAgainstRefData(fileName, data) {
		const bridge = new JsMidiBridge();
	
	    // Load messages       
	    const dataJson = TestDataHandler.get(fileName);
	    
	    const expChecksum = new Uint8Array(JSON.parse(dataJson));
	    
	    const checksum = bridge.getChecksum(new Uint8Array(data));
	
		expect(checksum).toEqual(expChecksum);
	}	
}
