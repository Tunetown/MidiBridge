/**
 * This class can transfer data from/to a MIDI connection, by interfacing with itself (or a port of 
 * it) on the other device using SystemExclusive messages.
 */

/**
 * Bridge version
 */
const JMB_VERSION = "0.2.0";

/**
 * Manufacturer ID of JsMidiBridge
 */
const JMB_MANUFACTURER_ID = [0x00, 0xac, 0xdc];

/**
 * Command prefix to request a file to be transfered.
 * Syntax: [
 *     *PMB_REQUEST_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <Path name as null terminated string>
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
 *     <File id, 2 half-bytes>,
 *     <Amount of chunks to be expected, 4 half-bytes>
 *     <Path name as null terminated string>
 * ]
 */
const JMB_START_MESSAGE = [0x02];

/**
 * Command prefix for sending data chunks
 * Syntax: [
 *     *PMB_DATA_MESSAGE,
 *     <CRC-16, 3 half-bytes (only first 16 bits used, calculated over the rest of the message)>,
 *     <File id, 2 half-bytes>,
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
 *     <Error message (also packed in half-bytes!)>
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
const JMB_CHUNK_INDEX_SIZE_FULLBYTES = 3;
const JMB_CHUNK_INDEX_SIZE_HALFBYTES = 4;

/** 
 * Length of the file id (BEFORE packing! Therefore, 3 bytes will use 4 bytes in the end.) 
 */ 
const JMB_FILE_ID_LENGTH_FULLBYTES = 3;
const JMB_FILE_ID_LENGTH_HALFBYTES = 4;

/** 
 * Length of the checksum in the message. Must fit for 16 bits, so we need at least 3 MIDI half-bytes. 
 */ 
const JMB_CHECKSUM_LENGTH_FULLBYTES = 2;
const JMB_CHECKSUM_LENGTH_HALFBYTES = 3;

/** 
 * Endianess for conversion of numbers (not for the data itself!)
 */ 
//const JMB_NUMBER_ENC_ENDIANESS = "big";


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * MIDI Bridge
 */
class JsMidiBridge {

    #next_id = 1;              // Next file ID

	#writeFileId = null;       // Internal file ID currently received.
    #writeBuffer = "";         // Write buffer
    #writeFilePath = "";       // File path for receiving
    #writeAmountChunks = -1;   // Amount of chunks to be received
    #writeLastChunk = -1;      // Counts received chunks
    
    #readChunkSize = null;
    
    constructor(readChunkSize = 1024) {
		this.callbacks = new Callbacks();
		
		this.#readChunkSize = readChunkSize;
	}	

    // Send Messages ##########################################################################################################

    /**
	 * Opens a file, and send it in chunks (also called internally when a request comes in)
	 */
    async send(path) {
        if (!path) {
			throw new Error("No path");
		}

        // Generate new file ID (internally used)
        const fileIdBytes = this.generateFileId();     

        // Check if file exists and see how many chunks we will need
        const data = await this.callbacks.execute("file.get", path);
        if (!data) {
            throw new Error(path + " not found or empty");
        }        
        const amountChunks = Math.ceil(data.length / this.#readChunkSize);

        // Send start message
        await this.#sendStartMessage(
            path, 
            fileIdBytes,
            amountChunks
        );

        // Transfer in chunks
        let chunkIndex = 0;
        while(True) {
            const chunk = data.substring(0, this.#readChunkSize);
            data = data.substring(this.#readChunkSize);
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
    async request(path) {
        if (!path) {
			throw new Error("No path");
		}
        
        const payload = this.string2bytes(path);
        const checksum = this.getChecksum(payload);

        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_REQUEST_MESSAGE.concat(checksum, payload)
		);
    }
    

    /** 
	 * Send the "Start of transmission" message
	 */ 
    async #sendStartMessage(path, fileIdBytes, amountChunks) {     
        const amountChunksBytes = this.number2bytes(amountChunks, JMB_CHUNK_INDEX_SIZE_FULLBYTES);   
        
        const payload = fileIdBytes.concat(amountChunksBytes, this.string2bytes(path));
        const checksum = this.getChecksum(payload);
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_START_MESSAGE.concat(checksum, payload)
		);
    }


    /**
	 * Sends one chunk of data
	 */ 
    async #sendChunk(fileIdBytes, chunk, chunkIndex) {
        const dataBytes = this.string2bytes(chunk);
        const chunkIndexBytes = this.number2bytes(chunkIndex, JMB_CHUNK_INDEX_SIZE_FULLBYTES);
        
        const payload = fileIdBytes.concat(chunkIndexBytes, dataBytes);
        const checksum = this.getChecksum(payload);
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_DATA_MESSAGE.concat(checksum, payload)
		);
	}

    /** 
	 * Generate a file ID (4 bytes)
	 */ 
    generateFileId() {
        return this.number2bytes(++this.#next_id, JMB_FILE_ID_LENGTH_FULLBYTES);
    }
    

    // Receive Messages ##########################################################################################################


    /** 
	 * Must be called for every incoming MIDI message to receive data. This class only uses SysEx, so the incoming messages
     * have to feature the attributes "manufacturerId" and "data" to be regarded
	 */
    async receive(midiMessage) {
        // Check if the message has the necessary attributes
        if (!midiMessage.hasOwn("manufacturer_id") || !midiMessage.hasOwn("data")) {
			return;
		}
        
        // Is the message for us?
        if (JSON.stringify(midiMessage.manufacturerId) != JSON.stringify(JMB_MANUFACTURER_ID)) {
			return;
		}
        
        // This determines what the sender of the message wants to do
        const command_id = JSON.stringify(midiMessage.data.slice(
			0, 
			JMB_PREFIXES_LENGTH_HALFBYTES - 1
		))

        // Next there is the checksum for all messages
        const checksumBytes = midiMessage.data.slice(
			JMB_PREFIXES_LENGTH_HALFBYTES,
			JMB_PREFIXES_LENGTH_HALFBYTES + JMB_CHECKSUM_LENGTH_HALFBYTES - 1
		);
        let payload = midiMessage.data.slice(
			JMB_PREFIXES_LENGTH_HALFBYTES + JMB_CHECKSUM_LENGTH_HALFBYTES
		)

        try {
            // Checksum test
            if (this.getChecksum(payload) != checksumBytes) {
                throw new Error("Checksum mismatch");
            }

            // Receive: Message to request sending a file
            if (command_id == JSON.stringify(JMB_REQUEST_MESSAGE)) {
                // Send file
                await this.send(this.bytes2string(payload));
                return;
            }
            
            if (command_id == JSON.stringify(JMB_ERROR_MESSAGE)) {
                // Handle incoming error messages if an error handler is given
                await this.callbacks.execute("client.error", {
                    error: this.bytes2string(payload)
                });
                return;
            }

            // All other messages have a file ID coming next, so we split that off the payload
            const fileIdBytes = payload.slice(
				0, 
				JMB_FILE_ID_LENGTH_HALFBYTES - 1
			);
            payload = payload.slice(
				JMB_FILE_ID_LENGTH_HALFBYTES
			);

            // Receive: Start of transmission
            if (command_id == JSON.stringify(JMB_START_MESSAGE)) {
                await this.#receiveStart(fileIdBytes, payload);
            }

            // Receive: Data
            else if (command_id == JSON.stringify(JMB_DATA_MESSAGE)) {            
                if (fileIdBytes == this.#writeFileId) {
                    await this.#receiveData(payload);
                }
            }

            // Ack message
            else if (command_id == JSON.stringify(PMB_ACK_MESSAGE)) {
                await this.callbacks.execute("client.ack", {
					fileId: fileIdBytes
				});
			}               

        } catch(ex) {
            await this.#sendErrorMessage(ex.message);
		}
	}

    /**
	 * Start receiving file data
	 */
    async #receiveStart(fileIdBytes, payload) {
        // Reset state
        this.#writeLastChunk = -1;
        this.#writeFileId = fileIdBytes;
        this.#writeBuffer = "";
        
        // Amount of chunks overall
        this.#writeAmountChunks = this.bytes2number(payload.slice(0, JMB_CHUNK_INDEX_SIZE_HALFBYTES - 1));

        // Path to write to
        this.#writeFilePath = this.bytes2string(payload.slice(JMB_CHUNK_INDEX_SIZE_HALFBYTES));
                                
        // Signal start of transmission
        await this.callbacks.execute("receive.start", {
			path: this.#writeFilePath,
			fileId: fileIdBytes,
			numChunks: this.#writeAmountChunks
		});  
	}      

    /**
	 * Receive file data
	 */ 
    async #receiveData(payload) {        
        // Index of the chunk
        const index = this.bytes2number(payload.slice(0, JMB_CHUNK_INDEX_SIZE_HALFBYTES - 1));

        // Chunk data
        const str_data = this.bytes2string(payload.slice(JMB_CHUNK_INDEX_SIZE_HALFBYTES));
    
        // Only accept if the chunk index is the one expected
        if (index != this.#writeLastChunk + 1) {
            throw new Error("Invalid chunk " + index + ", expected " + (this.write_last_chunk + 1));
        }
        
        this.#writeLastChunk = index;

        // Append to file
        this.#writeBuffer += str_data;
        
        await this.callbacks.execute("receive.progress", {
			path: this.#writeFilePath,
			fileId: this.#writeFileId,
			chunk: index,
			numChunks: this.#writeAmountChunks,
			//chunk: str_data
		});  
        
        // If this has been the last chunk, close the file handle and send ack message
        if (index == this.#writeAmountChunks - 1) {
            await this.#receiveFinish();
        }
    }

    /**
	 * Finish receiving and send acknowledge message
	 */
    async #receiveFinish() {
        await this.callbacks.execute("receive.finish", {
			fileId: fileIdBytes,
			path: this.#writeFilePath,
			data: this.#writeBuffer,
			numChunks: this.#writeAmountChunks	
		});

        await this.#sendAckMessage(this.#writeFileId);
        
        this.#writeFileId = null;      
        this.#writeBuffer = "";
    }


    /**
	 * Sends the "acknowledge successful transfer" message
	 */
    async #sendAckMessage(fileIdBytes) {
        const payload = fileIdBytes;
        const checksum = this.getChecksum(payload);
        
        await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_ACK_MESSAGE.concat(checksum, payload)
		);        
	}

    /**
	 * Sends an error message
	 */
    async #sendErrorMessage(msg) {
        const payload = this.string2bytes(msg);
        const checksum = this.getChecksum(payload);

		await this.#sendSysex(
			JMB_MANUFACTURER_ID,
            JMB_ERROR_MESSAGE.concat(checksum, payload)
		); 
	}

    /**
	 * Send a MIDI message via callback
	 */
    async #sendSysex(manufacturerId, data) {
		await this.callbacks.execute("midi.sysex.send", {
			manufacturerId: manufacturerId,
			data: data
		});
	}
	

    // Checksum ###########################################################################################################


    /**
	 * Get checksum of bytes (only returns MIDI half-bytes)
	 */
    getChecksum(data) {
		if (!(data instanceof Uint8Array)) {
			throw new Error("Invalid input data, must be an Uint8Array");
		}
		
        if (!data) {
			ret = [];
			for(let i = 0; i < JMB_CHECKSUM_LENGTH_HALFBYTES; ++i) {
				ret.push(0);
			}
            return ret;
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
            let cur_byte = 0xFF & b;
            
            for (let x = 0; x < 8; ++x) {
                if ((crc & 0x0001) ^ (cur_byte & 0x0001)) {
					crc = (crc >> 1) ^ poly;
				} else {
					crc >>= 1;
				}                                       
                cur_byte >>= 1;
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