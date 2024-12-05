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
    #callbacks = null;
    #bridge = null            // JsMidiBridge instance

    constructor(midiAccess, callbacks, bridge) {
        this.#midiAccess = midiAccess;
        this.#callbacks = callbacks;
        this.#bridge = bridge
    }

    /**
     * Scan for ports (will call a callback when finished, updating the selector)
     */
    scan() {
        const ports = this.#getMatchingPorts();

        for (const port of ports) {
            // Check if the port has a bridge behind it (async, to have this process pseudo-parallel)
            this.#checkPort(port)
            .then(function(data) {
                console.log("Port succeeded!", data);
            })
            .catch(function(err) {
                console.log("Port failed", err);
            });
        }
    }

    /**
     * Check if the port has a bridge behind it. Rejects when not.  
     */
    async #checkPort(port) {
        const bridge = new JsMidiBridge();
        const that = this;

        // Callback enabling the bridge to send MIDI SysEx messages
        bridge.callbacks.register("Demo App", "midi.sysex.send", async function(data) {
            that.#sendSysex(
                port.output,
                data.manufacturerId,
                data.data
            )
        });

        return new Promise(function(resolve, reject) {
            bridge.callbacks.register("Demo App", "receive.start", async function(data) {
                resolve(port);
            });

            bridge.callbacks.register("Demo App", "error", async function(data) {
                reject(port);
            });

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
    #sendSysex(outputPort, manufacturerId, data) {

    }
}