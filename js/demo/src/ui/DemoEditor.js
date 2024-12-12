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
		this.#editor = CodeMirror(this.#editorElement[0], {
			mode: "python",
            lineNumbers: true
		});

        const that = this;

        this.#editor.on('change', function(/*obj*/) {
			that.#setDirty();			
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