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

BRIDGE_DEMO_VERSION = "0.1";

class Demo {

    ui = null;              // User interface
    routing = null;         // Routing
    
    #midi = null            // MIDI Bridge Handler (this manages the bridge instances)
    #connection = null;     // Current connection, holding the bridge instance and ports etc.

    #loadStartTime = 0;     // Used to calculate the average loading time per byte for estimations

    constructor(ui) {        
        this.ui = ui;        
        this.ui.init(this);
    }

    /**
     * Run the app
     */
    async run() {
        // Build DOM
        this.ui.build();        

        try {
            // Routing handler
            this.routing = new Routing(this);

            // MIDI bridge handler
            this.#midi = new MidiBridgeHandler();
            this.#midi.console = this.ui.console;

            // Initialize MIDI
            await this.#midi.init();
            this.ui.console.log("MIDI ready");

            // Run routing
            this.routing.run();

        } catch (e) {
            this.ui.console.error(e);
        }        
    }

    /**
     * Loads and shows the given path. Called by routing.
     */
    async scan() {
        try {
            // No port: Scan for ports (will redirect to the first available bridge)
            this.ui.showPath("");
            this.ui.listing.clear();
            this.ui.listing.message([
                "JsMidiBridge Demo v" + BRIDGE_DEMO_VERSION,
                "",
                "---------------------------------------------------------------------------------------------",
                "",
                '<a href="https://github.com/Tunetown/MidiBridge" target="_blank">JsMidiBridge</a> is a library to edit files via MIDI.',
                "",
                "This program will now attempt to scan all available MIDI ports for instances of a ",
                "compatible MidiBrigde port and redirect to the first found one's root folder.",
                "",
                "It serves as working demonstration and/or development tool to create online editors etc.,",
                "for example for CircuitPython based devices.",
                "",
                "---------------------------------------------------------------------------------------------",
                "",
                "(C) Thomas Weber 2024 tom-vibrant@gmx.de",
                "Licensed under GPL v3"
            ].join("\n"));

            this.ui.console.log("Scanning ports...");

            // Scan and open root folder of first found bridge.
            await this.#scanAndOpenFirst();
            
        } catch (e) {
            this.ui.console.error(e);
        }    
    }

    /**
     * Show ports overview
     */
    async showPorts() {
        if (this.#connection) {
            this.#midi.detach(this.#connection);
            this.#connection = null;
        }        
        
        try {
            this.ui.showPath("");
            this.ui.listing.clear();
            this.ui.listing.message("Available ports with a compatible bridge behind it:");
            this.ui.listing.message("");
            
            const that = this;
            await this.#midi.scan(function(data) {
                that.ui.listing.showPort(data);
            });
            
        } catch (e) {
            this.ui.console.error(e);
        }    
    }

    /**
     * Loads and shows the given path. Called by routing. This is used for both file content
     * and folder listings, as these are treated equally by the briidge, too.
     */
    async open(portName, path) {
        try {
            // Connect if not yet done
            await this.#connect(portName);
            
            if (path.length == 0 || path[0] != "/") {
                path = "/" + path;
            }

            this.ui.showPath(path);            
            this.ui.listing.clear();
            this.ui.listing.message("Loading " + portName + path + "...");

            // Request the data
            await this.#connection.bridge.request(path, BRIDGE_CHUNK_SIZE_REQUEST);

        } catch (e) {
            this.ui.console.error(e);
        }    
    }

    /**
     * Called by the UI to save the passed content.
     */
    async save(path, content) {
        if (!confirm("Do you want to save " + path + "?")) return;
        
        const errors = (new DemoLinter()).getAnnotations(content);
        if (errors) {
            if (!confirm(path + " contains syntax errors. Do you still want to save it?")) return;
        }

        try {
            this.ui.console.log("Writing " + this.portName() + path);

            await this.#connection.bridge.sendString(path, content, BRIDGE_CHUNK_SIZE_SEND);

        } catch (e) {
            this.ui.console.error(e);
        }  
    }

    /**
     * Returns the current connected port name.
     */
    portName() {
        if (!this.#connection) return "";
        return this.#connection.name;
    }

    /**
     * Returns a href for the passed path on the current port
     */
    getContentUrl(portName, path) {
        if (!portName) portName = this.portName();
        return encodeURI("content/" + portName + path);
    }

    /**
     * Scan ports and open the first one
     */
    async #scanAndOpenFirst() {
        const that = this;
        await this.#midi.scan(function(data) {
            setTimeout(function() {
                that.routing.call(that.getContentUrl(data.name, "/"));
            }, 0);
            return true
        });
    }

    /**
     * Set up the passed bridge. 
     */
    async #connect(connectionName) {
        if (this.#connection && this.#connection.name == connectionName) return;   // Already connected to the bridge
        
        if (this.#connection) {
            this.#midi.detach(this.#connection);
        }

        const connection = await this.#midi.connect(connectionName);
        const bridge = connection.bridge;

        const that = this;

        this.ui.console.log("Connected to " + connectionName);

        // Progress (send)
        bridge.onSendProgress = async function(data) {            
            if (data.type == "error") return;

            that.ui.progress((data.chunk + 1) / data.numChunks, "Writing chunk " + data.chunk + " of " + data.numChunks);

            if (data.chunk + 1 == data.numChunks) {
                that.ui.console.info("Successfully saved " + data.path);
            }
        };

        // Receive start
        bridge.onReceiveStart = async function(data) {
            that.#loadStartTime = Date.now();

            that.ui.showPath(data.path);
            that.ui.progress(0, "Loading " + data.path);
        };

        // Progress (receive)
        bridge.onReceiveProgress = async function(data) {
            that.ui.progress((data.chunk + 1) / data.numChunks, "Loading chunk " + data.chunk + " of " + data.numChunks);
        };

        // Receive finish
        bridge.onReceiveFinish = async function(data) {
            const timeMillis = Date.now() - that.#loadStartTime;
            that.ui.setLoadTime(timeMillis / data.data.length);

            that.#onReceiveFinish(data, timeMillis);
        };

        // Error handling for MIDI errors coming from the bridge
        bridge.onError = async function(message) {
            that.ui.console.error(message);
        }      
        
        this.#connection = connection;
    }

    /**
     * Called by #connect when finished
     */
    #onReceiveFinish(data, timeMillis) {
        this.ui.showContent(data.data);
        this.ui.progress(1);
        
        this.ui.console.info("Loaded " + this.portName() + data.path + " (took " + Tools.formatTime(timeMillis) + ")");
    }
}