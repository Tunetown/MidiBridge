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
    //#callbacks = null;  // Like the bridge internally, we use a callback based approach for everything
    routing = null;
    #bridge = null;

    constructor(ui) {        
        this.#ui = ui;        

        this.#ui.init(this);
        //this.#callbacks = new Callbacks();
    }

    /**
     * Run the app
     */
    async run() {
        // Build DOM
        this.#ui.build();        

        // MIDI bridge handler
        this.#midi = new MidiBridgeHandler();

        // Router
        this.routing = new Routing(this);

        // Initialize bridge.
        try {
            await this.#midi.init();

            const that = this;
            await this.#midi.scan(function(data) {
                if (that.#bridge) return;   // Already connected

                that.#initConnection(data.bridge);

                that.routing.run();
            });

            
        } catch (e) {
            console.error(e);
        }        
    }

    /**
     * Loads and shows the given path. Called by routing.
     */
    open(path) {
        console.log("Open " + path)

        this.#ui.showPath(path);
        this.#ui.showContent("Loading...");

        this.#bridge.request(path, BRIDGE_CHUNK_SIZE);
    }

    /**
     * Set up callbacks
     */
    #initConnection(bridge) {
        const that = this;

        bridge.onReceiveStart = async function(data) {
            that.#ui.showPath(data.path);
            that.#ui.progress(0, "Loading " + data.path);
        };

        bridge.onReceiveProgress = async function(data) {
            that.#ui.progress((data.chunk + 1) / data.numChunks, "Loading chunk " + data.chunk + " of " + data.numChunks);
        };

        bridge.onReceiveFinish = async function(data) {
            that.#ui.showContent(data.data);
            that.#ui.progress(1);
        };

        bridge.onError = async function(message) {
            console.error(message);
            that.#ui.error(message);
        }

        this.#bridge = bridge;
    }
}