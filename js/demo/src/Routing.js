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

            this.get(/\#\/(.*)/, that.#queue.add(async function() {
                const path = this.params['splat'];
                that.#app.open("/" + path);
            }));
        });
    }

    /**
	 * Start routing
	 */
	run() {
		this.sammy.run('#/');
	}
	
	/**
	 * Refresh current path
	 */
	refresh() {
		this.sammy.refresh();
	}

    /**
     * Calls the passed path
     */
    callPath(path) {
        location.href = location.protocol +'//'+ location.host + (location.pathname ? location.pathname : '') + '#' + path;
    }
}