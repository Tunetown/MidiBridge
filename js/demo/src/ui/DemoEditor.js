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

class DemoEditor {

    #editorElement = null;
    #editor = null;
    #ui = null;
    
    constructor(ui, editorElement) {
        this.#editorElement = editorElement;
        this.#ui = ui;

        this.#setupEditor();
    }

    /**
     * Create the editor instance
     */
    #setupEditor() {
        const that = this;

        // Editor
		this.#editor = CodeMirror(this.#editorElement[0], {
			mode: "python",
            gutters: ["CodeMirror-lint-markers"],
            lineNumbers: true,
            lint: {
                getAnnotations: function(source/*, options, editor*/) {                    
                    return (new DemoLinter()).getAnnotations(source);
                },
                highlightLines: true
            }
		});

        // Set dirty on change (shows the save button)
        this.#editor.on('change', function(/*obj*/) {
			that.#setDirty();
		});

        this.#initGlobalShortcuts();
    }

    /**
	 * Global key shortcuts
	 */
	#initGlobalShortcuts() {
		const that = this;
		
		// CTRL-S key to save
		$(window).on('keydown', async function(event) {
		    if (event.ctrlKey || event.metaKey) {
		        switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        
                        that.#ui.save();
                        
                        break;		        
		        }
		    }
		});
	}

    #setDirty() {
        this.#ui.setDirty();
    }

    show() {
        $(this.#editorElement).show();
    }

    hide() {
        $(this.#editorElement).hide();
    }

    getContent() {
       return this.#editor.getValue();
    }

    setContent(content) {
        this.#editor.setValue(content);        
    }
}