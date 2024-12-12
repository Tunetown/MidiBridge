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
class Routing {

    #queue = null;
    #app = null;

    constructor(app) {
        this.#queue = new CallbackQueue();
        this.#app = app;

        this.#setup();
    }

    /**
	 * Set up routing
	 */
    #setup() {
        const that = this;
        
        // Initialze sammy.js routing. Here, all routes are defined:
        this.sammy = $.sammy('body', function() {

            // Scan routes
            this.get("#", that.#queue.add(async function() {
                await that.#app.scan();
            }));

            this.get("#/", that.#queue.add(async function() {
                await that.#app.scan();
            }));

            // Show available ports
            this.get("#ports", that.#queue.add(async function() {
                await that.#app.showPorts();
            }));

            // SHow contents
            this.get(/\#content\/(.*)/, that.#queue.add(async function() {
                let path = decodeURI(this.params['splat'][0]);
                console.log(path)
                const tokens = path.split("/");

                const portName = tokens.shift();
                path = tokens.join("/");                

                await that.#app.open(portName, path);
            }));
        });

        // Error handling
        this.sammy.error = function(exp) {
            that.#app.ui.console.error("Route not found or errors thrown:");
            that.#app.ui.console.error(exp);
        }
    }

    /**
	 * Start routing
	 */
	run() {
		this.sammy.run('#/');
	}
	
	/**
	 * Refresh
	 */
	refresh() {
		this.sammy.refresh();
	}

    /**
     * Calls the passed uri path
     */
    call(path) {
        location.href = location.protocol +'//'+ location.host + (location.pathname ? location.pathname : '') + '#' + encodeURI(path);
    }
}