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
    #pathInput = null;              // Input element for the path
    #app = null;                    // app reference

    #editor = null;                 // Instance of DemoEditor
    #listing = null;                // Instance of DemoFolderListing
    
    #block = null;                  // Block element (background for progress bar)
    #progressBar = null;            // Progress bar inner element (the one to resize)

    #saveButton = null;

    console = null;                 // Instance of DemoConsole

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

        let editorElement = null;
        let folderListingElement = null;
        let consoleElement = null;

        this.#containerElement.append(
            // Path input
            $('<div class="header"/>').append(
                $('<div class="pathInput" />').append(
                    this.#pathInput = $('<input name="pathInput" type="text" />')
                    .keypress(function (e) {
                        if (e.which == 13) {
                            that.#app.routing.callPath(this.value);
                        }
                    })
                ),
                $('<div class="buttons" />').append(
                    this.#saveButton = $('<div class="fa fa-save" />')
                    .on("click", function(event) {
                        that.#save();
                    })
                )
            ),

            // Content
            $('<div class="contentArea"/>').append(
                folderListingElement = $('<div class="folderListing"/>').text("Connecting, please wait..."),

                // Editor
                editorElement = $('<div class="editor"/>'),

                this.#block = $('<div class="block"/>').append(
                        $('<div class="progressBarOuterContainer" />').append(
                        $('<span class="progressBarContainer" />').append(
                            $('<div class="progressBarBack" />').append(
                                this.#progressBar = $('<div class="progressBar" />')
                            )
                        )
                    )
                ).hide()
            ),

            // Error panel
            consoleElement = $('<div class="console"/>')
        )

        this.#editor = new DemoEditor(editorElement, this);
        this.#listing = new DemoFolderListing(folderListingElement);
        this.console = new DemoConsole(consoleElement);

        this.#editor.hide();
    }
    
    /**
     * Trigger saving
     */
    async #save() {
        const content = this.#editor.getContent();
        await this.#app.save(this.#pathInput.val(), content);
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
        if (this.#listing.show(this.#pathInput.val(), content)) {
            this.#editor.hide();
        } else {
            this.#editor.show();
            this.#editor.setContent(content);
        }

        this.resetDirtyState();
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

        const perc = (percentage * 100).toFixed(2);  
		
		this.#progressBar.css('width', perc + '%');		

        this.#block.show();
    }

    /**
     * Call this with statistics to estimate load times.
     */
    setLoadTime(millisPerByte) {
        this.#listing.setLoadTime(millisPerByte);
    }

    /**
     * Show the dirty marker
     */
    setDirty() {
        this.#saveButton.show();
    }

    resetDirtyState() {
        this.#saveButton.hide();
    }
}