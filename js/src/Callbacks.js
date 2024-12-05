/**
 * Generic callbacks.
 * 
 * (C) Thomas Weber 2021 tom-vibrant@gmx.de
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
class Callbacks {
	
	#options = {};

	#callbacks = null;
	
	/**
	 * options:
	 * {
	 *     errorHandler:     (ErrorHandler) If set, errors are handled by default and processing is  
	 *                       continued. If omitted, errors will be thrown.
	 * }
	 */
	constructor(options) {
		if (options) this.#options = options;

		this.#callbacks = new Map();
	}
	
	/**
	 * Registers a callback for the given action ID(s). The callbacks will be called after
	 * the action has taken place. actionIdPrefix can also be an array.
	 * 
	 * Parameters to the callback are: (data), where data is a parameter depending on the type of action.
	 * Each callback can optionally return a promise which is waited for before continuing.
	 */
	register(processId, actionIdPrefix, callback, priority) {
		if (Array.isArray(actionIdPrefix)) {
			for(const apf of actionIdPrefix) {
				this.register(processId, apf, callback, priority);
			}
			return;
		}
		
		let cb = this.#callbacks.get(actionIdPrefix);
		
		if (!cb || !cb.handlers) {
			// No data yet: Create handlers array and map entry
			cb = {
				handlers: []
			};
			
			this.#callbacks.set(actionIdPrefix, cb);
		}

		// Add handler
		cb.handlers.push({
			processId: processId, 
			callback: callback,
			priority: priority ? priority : 0,
			id: this.#getUuid()
		});
	}
	
	#uuidSeed = 0;
	
	/**
	 * Generate 8 character uuids. 
	 * 
	 * TODO find better algorithm, this has problems but works for now. Problem is: After page Reload, for the next #uuidSeed milliseconds, the IDs can collide very likely.
	 */
	#getUuid() {
		return (Date.now() + (this.#uuidSeed++)).toString(36);
	}
	
	/**
	 * Delete callbacks starting with the given processIdPrefix. processIdPrefix can also be an array, or null/'' to delete all callbacks.
	 */
	delete(processIdPrefix) {
		if (Array.isArray(processIdPrefix)) {
			for(const ppf of processIdPrefix) {
				this.delete(ppf);
			}
			return;
		}
		
		if (!processIdPrefix || (processIdPrefix == '')) {
			this.#callbacks = new Map();
			return;	
		}
		
		for(const [key, list] of this.#callbacks) {
			list.handlers = list.handlers.filter(function(item) {
				return !item.processId.startsWith(processIdPrefix);
			});
		}
	}
	
	/**
	 * Executes the callbacks for a given action id. These follow a prefix logic:
	 * All callbacks whose action id are a prefix of the passed actionIdPrefix are executed.
	 * Every callback is only executed once.
	 * If a callback returns something, the value will be returned immediately.
	 */
	async execute(actionId, data, noErrorHandling) {
		// Get handlers to execute
		let handlers = [];
		
		for(const [actionIdPrefix, list] of this.#callbacks) {
			if (!actionId.startsWith(actionIdPrefix)) continue;
			
			for(const handler of list.handlers) {
				if (!handler.callback) continue;
				if (handlers.filter((item) => item.id == handler.id).length) continue; // Already called
		
				handlers.push(handler);
			}
		}
		
		// Sort handlers by priority
		handlers.sort((a, b) => b.priority - a.priority);
		
		// Debug messages
		//this.#debugMessages(actionId, data, handlers);
		
		// Execute handlers
		for(const handler of handlers) {
			try {
				const ret = await handler.callback(data);
				
				if (ret) return ret;
				
			} catch (err) {
				if (!this.#options.errorHandler || noErrorHandling) throw err;
				
				this.#options.errorHandler.handle(err);
			}
		}
		
		return null;
	}
}
	