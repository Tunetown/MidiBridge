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

class Demo {

    #bridge = null;     // JsMidiBridge instance
    #midi = null        // MIDIAccess object
    #ui = null;         // User interface
    #callbacks = null;  // Like the bridge internally, we use a callback based approach for everything

    constructor(ui) {
        this.#ui = ui;
        this.#callbacks = new Callbacks();
    }

    /**
     * Run the app
     */
    run() {
        // Build DOM
        this.#ui.build();

        // Setup MIDI communication (run async!)
        this.#setupMidi();

        // Set up the MidiBridge
        this.#setupBridge();
    }

    /**
     * Sets up MIDI communication
     */
    async #setupMidi() {
        const that = this

        async function onMIDISuccess(midiAccess) {
            console.log("MIDI ready!");

            if (!midiAccess.sysexEnabled) {
                throw new Error("You must allow SystemExclusive messages");
            }

            that.#midi = new MidiHandler(midiAccess, that.#callbacks, that.#bridge);

            // Scan for ports (will call a callback when finished, updating the selector)
            await that.#midi.scan();
        }

        async function onMIDIFailure(msg) {
            console.error(`Failed to get MIDI access - ${msg}`);
        }

        await navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    }

    /**
     * Sets up the MIDI bridge
     */
    #setupBridge() {
        this.#bridge = new JsMidiBridge();

        // // Callback enabling the bridge to send MIDI SysEx messages
        // this.#bridge.callbacks.register("Demo App", "midi.sysex.send", async function(data) {
        //     // Send message
        // });

        // // Callback to deliver "file" data to the bridge (here, in JS we do not use files but the callback
        // // just has to return the correct content for the given path)
        // this.#bridge.callbacks.register("Demo App", "file.get", async function(data) {
        //     // Return content
        // });

        // // Callbacks to interact with receiving data, in the order they are normally called.
        // this.#bridge.callbacks.register("Demo App", "receive.start", async function(data) {
        //     // Start transmission
        // });

        // this.#bridge.callbacks.register("Demo App", "receive.progress", async function(data) {
        //     // Receive progress information
        // });

        // this.#bridge.callbacks.register("Demo App", "receive.finish", async function(data) {
        //     // Receive data
        // });

        this.#bridge.callbacks.register("Demo App", "receive.ack", async function(data) {
            // Receive an acknowledgement message from the other device when it successfully stored a file sent from here
            console.log("Successfully wrote " + data.path);
        });
        
        this.#bridge.callbacks.register("Demo App", "error", async function(data) {
            // Error handling (called when the other device sends an error MIDI message)
            console.error(data)
        });        
    }
}