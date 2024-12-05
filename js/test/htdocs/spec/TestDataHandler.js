const TEST_DATA_FOLDER = "data/";


class TestDataHandler {
	
	/**
	 * Loads the passed test file synchronously and returns its contents.
	 */
	static get(fileName) {
		const url = TEST_DATA_FOLDER + fileName;
		
		const request = new XMLHttpRequest();
		request.open("GET", url, false);
		
		request.send(null);
		if (request.status !== 200) {
			throw new Error("HTTP Error: " + request.status);				
		}
		
		return request.responseText;
	}	
}