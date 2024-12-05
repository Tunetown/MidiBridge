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
    #bridge = null            // JsMidiBridge instance
    #listeningPort = null

    constructor(midiAccess, callbacks, bridge) {
        this.#midiAccess = midiAccess;
        //this.#callbacks = callbacks;
        this.#bridge = bridge

        // Callback enabling the bridge to send MIDI SysEx messages
        // const that = this;
        // this.#bridge.callbacks.register("Demo App", "midi.sysex.send", async function(data) {
        //     if (!that.#outputPort) {
        //         console.log("No port chosen");
        //         return;
        //     }

        //     await that.#sendSysex(
        //         that.#outputPort,
        //         data.manufacturerId,
        //         data.data
        //     )
        // });
    }

    /**
     * Scan for ports (will call a callback when finished, updating the selector)
     */
    async scan() {
        const ports = this.#getMatchingPorts();
                
        for (const port of ports) {
            this.#checkPortAndAttach(port);
        }

        this.#bridge.request("/switches.py");  // TODO use getcwd instead
    }

    async #checkPortAndAttach(port) {
        // Check if the port has a bridge behind it (async, to have this process pseudo-parallel)
        try {
            const data = await this.#checkPort(port);
                
            console.log("Port succeeded!", data);

            this.#bridge.callbacks.delete(this.#getScanProcessId(port))

            this.#listenTo(data);

            return;

        } catch (e) {
            console.log("Port failed", e);

            this.#bridge.callbacks.delete(this.#getScanProcessId(port))
        }
    }

    /**
     * Start listening to a port (connects the bridge to it)
     */
    #listenTo(port) {
        if (!this.#listeningPort) return;

        this.#listeningPort = port;
        
        const that = this;
        port.input.onmidimessage = function(event) {
            that.#processMidiMessage(port, event);
        }
    }

    /**
     * Process incoming messages
     */
    #processMidiMessage(port, event) {
        let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;

        for (const character of event.data) {
            str += `0x${character.toString(16)} `;
        }
        
        console.log(str);
    }

    /**
     * Check if the port has a bridge behind it. Rejects when not.  
     */
    async #checkPort(port) {
        const that = this;

        return new Promise(function(resolve, reject) {
            that.#bridge.callbacks.register(that.#getScanProcessId(port), "midi.sysex.send", async function(data) {
                await that.#sendSysex(
                    port.output[1],
                    data.manufacturerId,
                    data.data
                )
            });
            that.#bridge.callbacks.register(that.#getScanProcessId(port), "receive.start", async function(data) {
                console.log("Received start", data)
                resolve(port);
            });

            that.#bridge.callbacks.register(that.#getScanProcessId(port), "error", async function(data) {
                console.error("Received error", data)
                reject(port);
            });            
        });
    }

    /**
     * Get temporary process IDs for the callback (so we can delete those later
     */
    #getScanProcessId(port) {
        return "Scan " + port.output[1].name;
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
                    console.log("Found matching ins/outs: " + out_data.name);
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

        console.log("Sending message to " + outputPort.name + ": ", msg);
        
        await outputPort.send(msg);
    }
}