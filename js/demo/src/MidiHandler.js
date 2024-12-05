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

class MidiHandler {

    #midiAccess = null;       // MIDIAccess instance
    //#callbacks = null;

    constructor(midiAccess, callbacks) {
        this.#midiAccess = midiAccess;
        //this.#callbacks = callbacks;
    }

    /**
     * Scan for ports (will call a callback when finished, updating the selector)
     */
    async scan() {
        const ports = this.#getMatchingPorts();
                
        for (const port of ports) {
            // Called async!
            this.#checkPort(port);
        }        
    }

    /**
     * Check if the port has a bridge behind it (async, to have this process pseudo-parallel)
     */
    async #checkPort(port) {
        try {
            const data = await this.#checkIfPortIsListening(port);
                
            console.log("   -> Scan: Port succeeded!", port.output[1].name);

            this.#setupPort(port);

        } catch (port) {
            console.log("   -> Scan: Port failed", port.output[1].name);
        }        
    }

    /**
     * Set up a port for productive use
     */
    async #setupPort(port) {
        const bridge = new JsMidiBridge();

        bridge.callbacks.register("Demo App", "receive.start", async function(data) {
            console.log("Received start", data)
        });

        bridge.callbacks.register("Demo App", "error", async function(data) {
            console.error("Received error", data)
        }); 
        
        bridge.callbacks.register("Demo App", "receive.progress", async function(data) {
            console.log("Received progress", data)
        }); 

        bridge.callbacks.register("Demo App", "receive.finish", async function(data) {
            console.log("Received finish", data)
        }); 

        this.#listenTo(port.input[1], bridge);

        await bridge.request("/switches.py");   // TODO control via UI

        console.log("FIN")
    }

    /**
     * Start listening to a port (connects the bridge to it)
     */
    #listenTo(port, bridge) {
        console.log("Listening to port " + port.name)

        port.onmidimessage = async function(event) {       
            // Check if its a sysex message
            if (event.data[0] != 0xf0 || event.data[event.data.length - 1] != 0xf7) {
                return;
            }

            const manufacturerId = Array.from(event.data).slice(1, 4);
            const data = Array.from(event.data).slice(4, event.data.length - 1);
            
            console.log("SysEx coming in on " + port.name + ":")
            console.log(manufacturerId, data);

            // Pass it to the bridge
            await bridge.receive({
                manufacturerId: manufacturerId,
                data: data
            });
        }
    }

    /**
     * Stop listening to a port
     */
    #unlisten(port) {
        port.onmidimessage = null;
    }

    /**
     * Check if the port has a bridge behind it. Rejects when not.  
     */
    async #checkIfPortIsListening(port) {
        const that = this;

        return new Promise(function(resolve, reject) {
            const bridge = new JsMidiBridge();

            bridge.callbacks.register("Scan", "midi.sysex.send", async function(data) {
                await that.#sendSysex(
                    port.output[1],
                    data.manufacturerId,
                    data.data
                )
            });

            bridge.callbacks.register("Scan", "receive.start", async function(data) {
                console.log("start", data)                
            });

            bridge.callbacks.register("Scan", "receive.finish", async function(data) {
                console.log(" -> Scan Success! " + port.output[1].name + ": Got start message, so someone is listening")
                that.#unlisten(port.input[1]);
                resolve(port);
            });

            bridge.callbacks.register("Scan", "receive.progress", async function(data) {
                console.log("chunk", data)
            });

            bridge.callbacks.register("Scan", "error", async function(data) {
                console.error(" -> Scan Failed. Nobody listening", data)
                that.#unlisten(port.input[1]);
                reject(port);
            }); 
            
            // Attach listener
            that.#listenTo(port.input[1], bridge);

            // Request sometihing
            bridge.request("/switches.py");  // TODO use getcwd instead
        });
    }

    /**
     * Gets a port list, which is an array of objects like:
     * {
     *     input:
     *     output:
     * }
     */
    #getMatchingPorts() {
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