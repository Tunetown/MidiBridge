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
 * issue #158 of the API, which sadly is still open.
 */
const BRIDGE_CHUNK_SIZE = 100;

class MidiHandler {

    #midiAccess = null;       // MIDIAccess instance
    //#callbacks = null;

    constructor(midiAccess, callbacks) {
        this.#midiAccess = midiAccess;
        //this.#callbacks = callbacks;
    }

    /**
     * Scan for ports with bridges behind (attach a bridge to every port, and see where sometging is coming back)
     */
    attach() {
        // Get all in/out pairs sharing the same name
        const ports = this.#getMatchingPortPairs();

        // Start connecting to all of them (connectToPort will be called async without await 
        // for pseudo parallel processing)
        for (const pair of ports) {            
            this.#connectPortPair(pair);
        }        
    }

    /**
     * Connect to a port pair (exception handling, the work is done in doConnectPort)
     */
    async #connectPortPair(pair) {
        try {
            await this.#doConnectPortPair(pair);
                
            console.log("   -> Scan: Port succeeded!", pair.output[1].name);

            //this.#setupPort(port);

        } catch (e) {
            console.log("   -> Scan: Port failed", pair.output[1].name);
        }        
    }

    /**
     * Connect to a port pair. 
     */
    async #doConnectPortPair(pair) {
        const that = this;

        return new Promise(function(resolve, reject) {
            const bridge = new JsMidiBridge();

            bridge.callbacks.register("Scan", "midi.sysex.send", async function(data) {
                await that.#sendSysex(
                    pair.output[1],
                    data.manufacturerId,
                    data.data
                )
            });

            bridge.callbacks.register("Scan", "receive.start", async function(data) {
                console.log("start", data)                
            });

            bridge.callbacks.register("Scan", "receive.finish", async function(data) {
                console.log(" -> Scan Success! " + pair.output[1].name + ": Got start message, so someone is listening")
                console.log(data.data)
                resolve({
                    bridge: bridge,
                    pair: pair,
                });
            });

            // bridge.callbacks.register("Scan", "receive.progress", async function(data) {
            //     console.log("chunk", data)
            // });

            bridge.callbacks.register("Scan", "error", async function(data) {
                console.log(" -> Bridge error received, so we are right here", data)
                resolve({
                    pair: pair
                });
            }); 
            
            // Attach listener
            that.#listenTo(pair.input[1], bridge);

            bridge.request("/", BRIDGE_CHUNK_SIZE);
        });
    }

    /**
     * Start listening to a port (connects the bridge to it)
     */
    #listenTo(port, bridge) {
        console.log("Listening to port " + port.name)

        port.onmidimessage = async function(event) {
            // Check if its a sysex message
            if (event.data[0] != 0xf0) { //} || event.data[event.data.length - 1] != 0xf7) {
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
            const in_data = input[1];

            // Get corresponding output
            for (const output of this.#midiAccess.outputs) {
                const out_data = output[1];

                if ((out_data.manufacturer == in_data.manufacturer) && (out_data.name == in_data.name)) {
                    console.log("Scan: Found matching ins/outs: " + out_data.name);
                    ret.push({
                        input: input,
                        output: output
                    });
                }
            }
        }

        return ret;
    } 
      
    /**
     * Send a sysex message to the passed output Port (instance of MIDIOutput)
     */
    async #sendSysex(outputPort, manufacturerId, data) {
        const msg = [
            0xf0
        ].concat(
            manufacturerId,   
            data,
            [
                0xf7
            ]
        );

        //console.log("Sending message to " + outputPort.name + ": ", msg);
        
        await outputPort.send(msg);
    }
}