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

class DemoUserInterface {

    #containerElement = null;       // DOM element for the contents
    #pathInput = null;
    #app = null;
    #editorElement = null;
    #editor = null;
    #block = null;
    #progressBar = null;

    constructor(containerElement) {
        this.#containerElement = containerElement;
    }

    init(app) {
        this.#app = app;        
    }

    /**
     * Build DOM
     */
    build() {
        const that = this;

        this.#containerElement.append(
            // Path input
            $('<div class="path"/>').append(
                this.#pathInput = $('<input name="pathInput" type="text" />')
                .keypress(function (e) {
                    if (e.which == 13) {
                        that.#app.routing.callPath(this.value);
                    }
                })
            ),

            // Editor
            this.#editorElement = $('<div class="editor"/>'),

            this.#block = $('<div class="block"/>').append(
                    $('<div class="progressBarOuterContainer" />').append(
                    $('<span class="progressBarContainer" />').append(
                        $('<div class="progressBarBack" />').append(
                            this.#progressBar = $('<div class="progressBar" />')
                        )
                    )
                )
            ).hide()
        )

        this.#setupEditor();
    }

    #setupEditor() {
        // Create the editor instance
		this.#editor = CodeMirror(this.#editorElement[0], {
			mode: "python"
		});

        const that = this;

        this.#editor.on('change', async function(/*obj*/) {
			await that.#setDirty();			
		});
    }

    async #setDirty() {
        // TODO
    }

    /**
     * Shows the passed path
     */
    showPath(path) {
        this.#pathInput.val(path);
    }

    /**
     * Show the passed content
     */
    showContent(content) {
        this.#editor.setValue(content);
    }

    /**
     * Show an error
     */
    error(message) {
        //this.#editor.setValue(message);
    }

    /**
     * Show progress. Values above 1 hide the progress bar.
     * 
     * @param {*} percentage range [0..1]
     * @param {*} message 
     */
    progress(percentage, message) {
        if (percentage >= 1) {
            this.#block.hide();
            return;
        }

        this.#block.show();

        const perc = (percentage * 100).toFixed(2);  
		
		this.#progressBar.css('width', perc + '%');		
    }
}