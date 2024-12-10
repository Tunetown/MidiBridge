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
    routing = null;     // Routing
    #bridge = null;     // Bridge instance

    #loadStartTime = 0; // Used to calculate the average loading time per byte for estimations


    constructor(ui) {        
        this.#ui = ui;        

        this.#ui.init(this);
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

                that.#initConnection(data.bridge, data.output.name);

                that.routing.run();
            });

            
        } catch (e) {
            this.#ui.console.error(e);
        }        
    }

    /**
     * Loads and shows the given path. Called by routing.
     */
    open(path) {
        this.#ui.showPath(path);
        this.#ui.showContent("Loading " + path + "...");

        this.#bridge.request(path, BRIDGE_CHUNK_SIZE);        
    }

    /**
     * Set up the passed bridge. 
     */
    #initConnection(bridge, connectionName) {
        const that = this;

        this.#ui.console.log("Connected to " + connectionName);

        // Receive start
        bridge.onReceiveStart = async function(data) {
            that.#loadStartTime = Date.now();

            that.#ui.showPath(data.path);
            that.#ui.progress(0, "Loading " + data.path);
        };

        // Progress
        bridge.onReceiveProgress = async function(data) {
            that.#ui.progress((data.chunk + 1) / data.numChunks, "Loading chunk " + data.chunk + " of " + data.numChunks);
        };

        // Receive finish
        bridge.onReceiveFinish = async function(data) {
            const timeMillis = Date.now() - that.#loadStartTime;
            that.#ui.setLoadTime(timeMillis / data.data.length);

            that.#ui.showContent(data.data);
            that.#ui.progress(1);

            that.#ui.console.log("Loaded " + data.path + " (took " + Tools.formatTime(timeMillis) + ")");
        };

        // Error handling for MIDI errors coming from the bridge
        bridge.onError = async function(message) {
            that.#ui.console.error(message);
        }

        this.#bridge = bridge;
    }
}