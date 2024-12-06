/**
 * MIDI Bridge to transfer string data between devices via MIDI.
 * 
 * (C) Thomas Weber 2024 tom-vibrant@gmx.de
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * This class can transfer data from/to a MIDI connection, by interfacing with itself (or a port of 
 * it) on the other device using SystemExclusive messages.
 */

/**
 * Bridge version
 */
const JMB_VERSION = "0.3.0";

/**
 * Manufacturer ID of JsMidiBridge
 */
const JMB_MANUFACTURER_ID = [0x00, 0x7c, 0x7d];

/**
 * Command prefix to request a file to be transfered.
 * Syntax: [
 *     *PMB_REQUEST_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <Requested chunk size, 4 half-bytes>
 *     <Path name as utf-8 bytes with no null termination>
 * ]
 */
const JMB_REQUEST_MESSAGE = [0x01];

/** 
 * Command prefix to signal start of transfer. The file ID is a random requence used to identify 
 * the file during the transfer, and is not used afterwards.
 *
 * Syntax: [
 *     *PMB_START_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <Transmission id, 2 half-bytes>,
 *     <Amount of chunks to be expected, 4 half-bytes>
 *     <Path name as utf-8 bytes with no null termination>
 * ]
 */
const JMB_START_MESSAGE = [0x02];

/**
 * Command prefix for sending data chunks
 * Syntax: [
 *     *PMB_DATA_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <Transmission id, 2 half-bytes>,
 *     <Chunk index, 4 half-bytes>,
 *     <Payload, variable length>
 * ]
 */
const JMB_DATA_MESSAGE = [0x03];

/**
 * Command prefix for the acknowledge message, which is sent after receiving a file successfully
 * Syntax: [
 *     *PMB_ACK_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <File id, 2 half-bytes>
 * ]
 */
const JMB_ACK_MESSAGE = [0x04];

/**
 * Command prefix for error messages
 * Syntax: [
 *     *PMB_ERROR_MESSAGE,
 *     <Error message as utf-8 bytes with no null termination>
 * ]
 */
const JMB_ERROR_MESSAGE = [0x7f];


//////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** 
 * All command prefixes above have to be exactly this long
 */ 
const JMB_PREFIXES_LENGTH_HALFBYTES = 1; 

/** 
 * Size of the chunk index (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.)
 */ 
const JMB_NUMBER_SIZE_FULLBYTES = 3;
const JMB_NUMBER_SIZE_HALFBYTES = 4;

/** 
 * Length of the file id (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.) 
 */ 
const JMB_TRANSMISSION_ID_LENGTH_FULLBYTES = 3;
const JMB_TRANSMISSION_ID_LENGTH_HALFBYTES = 4;

/** 
 * Length of the checksum in the message. Must fit for 16 bits, so we need at least 3 MIDI half-bytes. 
 */ 
const JMB_CHECKSUM_LENGTH_FULLBYTES = 2;
const JMB_CHECKSUM_LENGTH_HALFBYTES = 3;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * MIDI Bridge
 */
class JsMidiBridge {

    #nextId = 1;                         // Next file ID

	#receiveTransmissionId = null;       // Internal file ID currently received.
    #receiveBuffer = "";                 // Write buffer
    #receiveFilePath = "";               // File path for receiving
    #receiveAmountChunks = -1;           // Amount of chunks to be received
    #receiveLastChunk = -1;              // Counts received chunks
    
    throwExceptionsOnReceive = false;    // When receiving messages, throw exceptions instead of sending an error message (for testing)

    /**
     * Callback on errors received from the other side. message will be a string.
     */
    onError = async function(message) { console.error("Error from MIDI client: " + message) };

    /**
     * Callback to send System Exclusive MIDI messages. Both parameters will be arrays of integers in range [0..127].
     */
    sendSysex = async function(manufacturerId, data) { };

    /**
     * Callback to get file contents for the given path or file ID. Path will be a string.
     */
    getFile = async function(path) { throw new Error("No getFile callback set, cannot get data for " + path) };

    /**
     * Called when receiving starts. Data:
     * {
     *     path: 
     *     fileId:
     *     numChunks:
     * }
     */
    onReceiveStart = async function(data) {};
    
    /**
     * Called when a client sent an ack message. Data:
     * {
     *     fileId:
     * }
     */
    onReceiveAck = async function(data) {};

    /**
     * Called on every sent chunk. Data:
     * {
     *     path: 
     *     fileId:
     *     chunk:      Index of the current chunk
     *     numChunks:
     * }
     */
    onReceiveProgress = async function(data) {};

    /**
     * Called when a file has fully been received.
     * {
     *     path: 
     *     fileId:
     *     data:       The string data
     *     numChunks:
     * }
     */
    onReceiveFinish = async function(data) {};

    
    // Send Messages ##########################################################################################################

    /**
	 * Opens a file, and send it in chunks (also called internally when a request comes in)
	 */
    async send(path, chunkSize) {
        if (!path) {
			throw new Error("No path");
		}

        if (chunkSize < 1) {
			throw new Error("Invalid chunk size: " + chunkSize);
		}

        // Generate new file ID (internally used)
        const fileIdBytes = this.generateFileId();     

        // Check if file exists and see how many chunks we will need
        let data = await this.getFile(path);
        if (data === null) {
            throw new Error(path + " not found or empty");
        }        
        const amountChunks = Math.ceil(data.length / chunkSize);

        // Send start message
        await this.#sendStartMessage(
            path, 
            fileIdBytes,
            amountChunks
        );

        // Transfer in chunks
        let chunkIndex = 0;
        while(true) {
            const chunk = data.substring(0, chunkSize);
            data = data.substring(chunkSize);
            if (!chunk) {
				break;
			}

            await this.#sendChunk(fileIdBytes, chunk, chunkIndex);
            ++chunkIndex;
        }
    }

    /**
	 * Sends a MIDI message to request a file
	 */ 
    async request(path, chunkSize) {
        if (!path) {
			throw new Error("No path");
		}
        
        if (chunkSize < 1) {
			throw new Error("Invalid chunk size: " + chunkSize);
		}

        const payload = Array.from(this.number2bytes(chunkSize, JMB_NUMBER_SIZE_FULLBYTES)).concat(Array.from(this.string2bytes(path)));
        const checksum = Array.from(this.getChecksum(new Uint8Array(payload)));

        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_REQUEST_MESSAGE.concat(checksum, payload)
		);
    }
    

    /** 
	 * Send the "Start of transmission" message
	 */ 
    async #sendStartMessage(path, fileIdBytes, amountChunks) {     
        const amountChunksBytes = Array.from(this.number2bytes(amountChunks, JMB_NUMBER_SIZE_FULLBYTES));   
        const payload = Array.from(fileIdBytes).concat(amountChunksBytes, Array.from(this.string2bytes(path)));
        const checksum = Array.from(this.getChecksum(new Uint8Array(payload)));
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_START_MESSAGE.concat(checksum, payload)
		);
    }


    /**
	 * Sends one chunk of data
	 */ 
    async #sendChunk(fileIdBytes, chunk, chunkIndex) {
        const dataBytes = Array.from(this.string2bytes(chunk));
        const chunkIndexBytes = Array.from(this.number2bytes(chunkIndex, JMB_NUMBER_SIZE_FULLBYTES));
        
        const payload = Array.from(fileIdBytes).concat(chunkIndexBytes, dataBytes);
        const checksum = Array.from(this.getChecksum(new Uint8Array(payload)));
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_DATA_MESSAGE.concat(checksum, payload)
		);
	}

    /** 
	 * Generate a file ID (4 bytes)
	 */ 
    generateFileId() {
        return this.number2bytes(++this.#nextId, JMB_TRANSMISSION_ID_LENGTH_FULLBYTES);
    }
    

    // Receive Messages ##########################################################################################################


    /** 
	 * Must be called for every incoming MIDI message to receive data. This class only uses SysEx, so the incoming messages
     * have to feature the attributes "manufacturerId" and "data" to be regarded
	 */
    async receive(midiMessage) {
        // Check if the message has the necessary attributes
        if (!midiMessage || !midiMessage.hasOwnProperty("manufacturerId") || !midiMessage.hasOwnProperty("data")) {
			return;
		}
        
        // Is the message for us?
        if (JSON.stringify(midiMessage.manufacturerId) != JSON.stringify(JMB_MANUFACTURER_ID)) {
			return;
		}
        
        // This determines what the sender of the message wants to do
        const commandId = JSON.stringify(midiMessage.data.slice(
			0, 
			JMB_PREFIXES_LENGTH_HALFBYTES
		))

        // Next there is the checksum for all messages
        const checksumBytes = new Uint8Array(midiMessage.data.slice(
			JMB_PREFIXES_LENGTH_HALFBYTES,
			JMB_PREFIXES_LENGTH_HALFBYTES + JMB_CHECKSUM_LENGTH_HALFBYTES
		));
        let payload = new Uint8Array(midiMessage.data.slice(
			JMB_PREFIXES_LENGTH_HALFBYTES + JMB_CHECKSUM_LENGTH_HALFBYTES
		))
		
		try {			
            // Checksum test
            if (!this.#compareArrays(this.getChecksum(payload), checksumBytes)) {
                throw new Error("Checksum mismatch");
            }    

            // Receive: Message to request sending a file
            if (commandId == JSON.stringify(JMB_REQUEST_MESSAGE)) {
                // Send file
                await this.#receiveRequest(payload);
                return;
            }
            
            if (commandId == JSON.stringify(JMB_ERROR_MESSAGE)) {
                // Handle incoming error messages if an error handler is given
                const message = this.bytes2string(payload);

                await this.onError(message);
                return;
            }

            // All other messages have a file ID coming next, so we split that off the payload
            const fileIdBytes = payload.slice(
				0, 
				JMB_TRANSMISSION_ID_LENGTH_HALFBYTES
			);
						
            payload = payload.slice(
				JMB_TRANSMISSION_ID_LENGTH_HALFBYTES
			);
			
            // Receive: Start of transmission
            if (commandId == JSON.stringify(JMB_START_MESSAGE)) {				
				await this.#receiveStart(fileIdBytes, payload);
            }

            // Receive: Data
            else if (commandId == JSON.stringify(JMB_DATA_MESSAGE)) {  
                if (this.#compareArrays(fileIdBytes, this.#receiveTransmissionId)) {					
                    await this.#receiveData(payload);
                }
            }

            // Ack message
            else if (commandId == JSON.stringify(JMB_ACK_MESSAGE)) {                
                await this.onReceiveAck({
					fileId: fileIdBytes
				});
			}               

        } catch(ex) {
            await this.#sendErrorMessage(ex.message);

			if (this.throwExceptionsOnReceive) {
				throw ex;
			}
		}
	}
	
    /**
     * Request message received
     */
    async #receiveRequest(payload) {
        const chunkSize = this.bytes2number(payload.slice(0, JMB_NUMBER_SIZE_HALFBYTES));
        const path = this.bytes2string(payload.slice(JMB_NUMBER_SIZE_HALFBYTES));

        await this.send(path, chunkSize);
    }

    /**
	 * Start receiving file data
	 */
    async #receiveStart(fileIdBytes, payload) {
        // Reset state
        this.#receiveLastChunk = -1;
        this.#receiveTransmissionId = fileIdBytes;
        this.#receiveBuffer = "";
        
        // Amount of chunks overall
        this.#receiveAmountChunks = this.bytes2number(payload.slice(0, JMB_NUMBER_SIZE_HALFBYTES));

        // Path to write to
        this.#receiveFilePath = this.bytes2string(payload.slice(JMB_NUMBER_SIZE_HALFBYTES));
        
        // Signal start of transmission
        
        await this.onReceiveStart({
			path: this.#receiveFilePath,
			fileId: fileIdBytes,
			numChunks: this.#receiveAmountChunks
		});
	}      

    /**
	 * Receive file data
	 */ 
    async #receiveData(payload) {   
        // Index of the chunk
        const index = this.bytes2number(payload.slice(0, JMB_NUMBER_SIZE_HALFBYTES));

        // Chunk data
        const strData = this.bytes2string(payload.slice(JMB_NUMBER_SIZE_HALFBYTES));
    
        // Only accept if the chunk index is the one expected
        if (index != this.#receiveLastChunk + 1) {			
            throw new Error("Invalid chunk " + index + ", expected " + (this.#receiveLastChunk + 1));
        }
        
        this.#receiveLastChunk = index;

        // Append to file
        this.#receiveBuffer += strData;
            
        await this.onReceiveProgress({
			path: this.#receiveFilePath,
			fileId: this.#receiveTransmissionId,
			chunk: index,
			numChunks: this.#receiveAmountChunks
		});  
        
        // If this has been the last chunk, close the file handle and send ack message
        if (index == this.#receiveAmountChunks - 1) {
            await this.#receiveFinish();
        }
    }

    /**
	 * Finish receiving and send acknowledge message
	 */
    async #receiveFinish() {
        await this.onReceiveFinish({
			fileId: this.#receiveTransmissionId,
			path: this.#receiveFilePath,
			data: this.#receiveBuffer,
			numChunks: this.#receiveAmountChunks	
		});

        await this.#sendAckMessage(this.#receiveTransmissionId);
        
        this.#receiveTransmissionId = null;      
        this.#receiveBuffer = "";
    }


    /**
	 * Sends the "acknowledge successful transfer" message
	 */
    async #sendAckMessage(fileIdBytes) {
		const payload = Array.from(fileIdBytes);
        const checksum = Array.from(this.getChecksum(fileIdBytes));
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_ACK_MESSAGE.concat(checksum, payload)
		);        
	}

    /**
	 * Sends an error message
	 */
    async #sendErrorMessage(msg) {
		const payloadBytes = this.string2bytes(msg);
        const payload = Array.from(payloadBytes);
        const checksum = Array.from(this.getChecksum(payloadBytes));

		await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_ERROR_MESSAGE.concat(checksum, payload)
		); 
	}

    /**
	 * Send a MIDI message via callback
	 */
    async #sendSysex(manufacturerId, data) {
		if (!Array.isArray(manufacturerId)) throw new Error("Cannot send manufacturer id " + manufacturerId);
		if (!Array.isArray(data)) throw new Error("Cannot send data " + data);
		
        await this.sendSysex(manufacturerId, data);
	}

	/**
	 * Compare two Uint arrays (could be done more js like but works)
	 */
	#compareArrays(a, b) {
		if (a.length != b.length) {
			return false;
		}
		 
		for (let i = 0; i < a.length; ++i) {
			if (a[i] != b[i]) {
				return false;
			} 
		}
		
		return true;
	}

    // Checksum ###########################################################################################################


    /**
	 * Get checksum of bytes (only returns MIDI half-bytes)
	 */
    getChecksum(data) {
		if (!(data instanceof Uint8Array)) {
			throw new Error("Invalid input data, must be an Uint8Array");
		}
		
        const crc = this.#crc16(data);
        return this.number2bytes(crc, JMB_CHECKSUM_LENGTH_FULLBYTES);
	}

    /**
	 * CRC-16-CCITT Algorithm
	 * Taken from https://gist.github.com/oysstu/68072c44c02879a2abf94ef350d1c7c6 and ported to JS
	 */
    #crc16(data, poly = 0x6756) {
        let crc = 0xFFFF;
        
        for (const b of data) {
            let current = 0xFF & b;
            
            for (let x = 0; x < 8; ++x) {
                if ((crc & 0x0001) ^ (current & 0x0001)) {
					crc = (crc >> 1) ^ poly;
				} else {
					crc >>= 1;
				}                                       
                current >>= 1;
            }
        }
        
        crc = (~crc & 0xFFFF);
        crc = (crc << 8) | ((crc >> 8) & 0xFF);

        return crc & 0xFFFF;
    }


    // Conversions ##########################################################################################################


    /**
	 * String to bytearray conversion (only returns MIDI half-bytes)
	 */
    string2bytes(str) {
		let utf8Encode = new TextEncoder();
		const bytes = utf8Encode.encode(str);
        return this.packBytes(bytes);
	}

    /**
	 * Bytearray to string conversion
	 */ 
    bytes2string(data) {
		const bytes = this.unpackBytes(data);
		let utf8Decode = new TextDecoder();
		return utf8Decode.decode(new Uint8Array(bytes));
    }    

    /**
	 * Number to bytearray conversion (only returns MIDI half-bytes)
	 */
    number2bytes(num, numBytes) {	
		if (numBytes > 4) {
			throw new Error("JavaScript natively only supports up to 32bit integer arithmentic");
		}
			
		const arr = []

		for(let i = 0; i < numBytes; ++i) {
			const mask = 0xff << ((numBytes - i - 1) * 8);
			arr.push(
				(num & mask) >> ((numBytes - i - 1) * 8)
			);
		}

		return this.packBytes(new Uint8Array(arr));
	}

    /**
	 * Bytes to number conversion
	 */
    bytes2number(data) {
		const bytes = this.unpackBytes(data);
		const numBytes = bytes.length;
		
		let result = 0;
	    
	    for (let i = 0; i < numBytes; ++i) {			
	        result += bytes[i] << ((numBytes - i - 1) * 8);
	    }
	    
	    return result;
	}
    

    //#########################################################################################################################


    /**
	 * Packs full bytes into MIDI compatible half-bytes
	 */
    packBytes(data) {
        return this.#convertBitlength(data, 8, 7, true);
    }

    /**  
	 * Unpacks full bytes from MIDI compatible half-bytes
	 */ 
    unpackBytes(data) {
        return this.#convertBitlength(data, 7, 8, false);
    }
    

    /**
	 * Change bit length per byte
	 */
    #convertBitlength(data, bitlengthFrom, bitlengthTo, appendLeftovers) {
		if (!(data instanceof Uint8Array)) {
			throw new Error("Invalid input data, must be an Uint8Array");
		}
		
        let result = [];
        let buffer = [];

        function flush() {
            let newEntry = 0x00;
            
            while(buffer.length < bitlengthTo) {
                buffer.push(0);
            }

            for (let i = 0; i < buffer.length; ++i) {
                const e = buffer[i];
                if (e != 1) continue;

                const mask = (1 << (bitlengthTo - 1 - i));
                newEntry |= mask;
            }

            result.push(newEntry);
            buffer = [];
		}
		
        for (const b of data) {
            for (let i = 0; i < bitlengthFrom; ++i) {
                const mask = (1 << (bitlengthFrom - 1 - i));
                buffer.push(((b & mask) == mask) ? 1 : 0);

                if (buffer.length == bitlengthTo) {
                    flush();
                }
            }
        }

        if (appendLeftovers && buffer.length > 0) {
            flush();
        }

        return new Uint8Array(result);
    }
}