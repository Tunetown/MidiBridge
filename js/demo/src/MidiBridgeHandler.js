/**
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
 */

/**
 * Chunk size for requesting data. The Web MIDI API does silently fail on incoming messages
 * too big, by experiment 111 was the value which was working any time. Should be fixed with
 * issue https://github.com/WebAudio/web-midi-api/issues/158 of the Web MIDI API, which sadly is 
 * still open at the time of writing this (12/2024). Later this could be enlarged to reduce
 * protocol overhead.
 */
const BRIDGE_CHUNK_SIZE = 100;

/**
 * Timeout until it is assumed there is no client listening
 */
const TIMEOUT_INTERVAL_MILLIS = 1000;

/**
 * Use this class to initialize the bridge. You can either use scan() or directly connect() to a pair of input/output ports.
 */
class MidiBridgeHandler {

    #midiAccess = null;       // MIDIAccess instance
    #callbacks = null;        // Callbacks to control the UI

    constructor(midiAccess, callbacks) {
        this.#midiAccess = midiAccess;
        this.#callbacks = callbacks;
    }

    /**
     * Scan for ports with bridges behind (attach a bridge to every port, and see where something is coming back).
     */
    scan() {
        // Get all in/out pairs sharing the same name
        const ports = this.#getMatchingPortPairs();

        // Start connecting to all of them (connectToPort will be called async without await 
        // for pseudo parallel processing)
        for (const pair of ports) {            
            this.#scanPorts(pair.input, pair.output);
        }        
    }

    /**
     * Connect to a MIDI port pair. 
     */
    async #scanPorts(input, output) {
        try {
            await this.connect(input, output);
                
            console.log("   -> Connection success with ", output.name);

        } catch (e) {
            console.log("   -> Failed to connect to ", output.name);
        }        
    }

    /**
     * Connect to a port pair. 
     */
    async connect(input, output) {
        const that = this;

        const path = "notexistingfile";

        return new Promise(function(resolve, reject) {
            const bridge = new JsMidiBridge();

            bridge.sendSysex = async function(manufacturerId, data) {
                await that.#sendSysex(
                    output,
                    manufacturerId,
                    data
                )
            }

            // bridge.onReceiveStart = async function(data) {
            //     //console.log("start", data)                
            // }

            bridge.onReceiveFinish = async function(data) {
                //console.log(" -> Scan Success! " + output.name + ": Got a message, so someone is listening")                
                clearTimeout(timeout);
                resolve({
                    bridge: bridge,
                    input: input,
                    output: output
                });
            }

            // bridge.callbacks.register("Scan", "receive.progress", async function(data) {
            //     console.log("chunk", data)
            // });

            bridge.onError = async function(message) {
                //console.log(" -> Scan Success! " + output.name + ": Got an answer, so someone is listening");
                clearTimeout(timeout);
                resolve({
                    bridge: bridge,
                    input: input,
                    output: output
                });
            }
            
            // Attach listener
            that.#listenTo(input, bridge);

            bridge.request(path, BRIDGE_CHUNK_SIZE);

            // Timeout
            let timeout = setTimeout(function() {
                //console.log(" -> Timeout for " + pair.output[1].name);
                reject({
                    input: input,
                    output: output
                });
            }, TIMEOUT_INTERVAL_MILLIS);
        });
    }

    /**
     * Start listening to a port (connects the bridge to it)
     */
    #listenTo(input, bridge) {
        console.log("Listening to input port " + input.name)

        input.onmidimessage = async function(event) {
            // Check if its a sysex message
            if (event.data[0] != 0xf0 || event.data[event.data.length - 1] != 0xf7) {
                return;
            }

            const manufacturerId = Array.from(event.data).slice(1, 4);
            const data = Array.from(event.data).slice(4, event.data.length - 1);
            
            //console.log("SysEx coming in on " + port.name + " (" + event.data.length + " bytes):")
            //console.log(manufacturerId, data);

            // Pass it to the bridge
            await bridge.receive({
                manufacturerId: manufacturerId,
                data: data
            });
        }
    }

    /**
     * Gets a port list, which is an array of objects like:
     * {
     *     input:
     *     output:
     * }
     */
    #getMatchingPortPairs() {
        const ret = [];

        // Inputs
        for (const input of this.#midiAccess.inputs) {
            const in_handler = input[1];

            // Get corresponding output
            for (const output of this.#midiAccess.outputs) {
                const out_handler = output[1];

                if ((out_handler.manufacturer == in_handler.manufacturer) && (out_handler.name == in_handler.name)) {
                    console.log("Scan: Found matching ins/outs: " + out_handler.name);
                    ret.push({
                        input: in_handler,
                        output: out_handler
                    });
                }
            }
        }

        return ret;
    } 
      
    /**
     * Send a sysex message to the passed output Port (instance of MIDIOutput)
     */
    async #sendSysex(output, manufacturerId, data) {
        const msg = [
            0xf0
        ].concat(
            manufacturerId,   
            data,
            [
                0xf7
            ]
        );

        await output.send(msg);
    }
}