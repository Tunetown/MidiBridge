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

            that.#midi = new MidiHandler(midiAccess, that.#callbacks);

            // Scan for ports (will call a callback when finished, updating the selector)
            await that.#midi.scan();
        }

        async function onMIDIFailure(msg) {
            console.error(`Failed to get MIDI access - ${msg}`);
        }

        await navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    }
}