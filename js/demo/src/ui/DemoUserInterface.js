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
    
    #block = null;                  // Block element (background for progress bar)
    #progressBar = null;            // Progress bar inner element (the one to resize)
    #progressMessage = null;        // Messages for progress

    #saveButton = null;

    listing = null;                 // Instance of DemoListing
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
        let listingElement = null;
        let consoleElement = null;

        this.#containerElement.append(
            // Path input
            $('<div class="header"/>').append(
                $('<div class="pathInput" />').append(
                    this.#pathInput = $('<input name="pathInput" type="text" />')
                    .keypress(function (e) {
                        if (e.which == 13) {
                            that.#app.routing.call(that.#app.getContentUrl(null, this.value));
                        }
                    })
                ),
                $('<div class="buttons" />').append(
                    // Save button
                    this.#saveButton = $('<div class="fa fa-save" />')
                    .on("click", function(event) {
                        const content = that.#editor.getContent();
                        that.#app.save(that.#pathInput.val(), content);
                    })
                )
            ),

            // Content
            $('<div class="contentArea"/>').append(
                listingElement = $('<div class="listing"/>'),

                // Editor
                editorElement = $('<div class="editor"/>'),

                // Progress bar and blocker
                this.#block = $('<div class="block"/>').append(
                    $('<span class="progressBar" />').append(   // progressBarOuterContainer
                        $('<span />').append(  //progressBarContainer
                            $('<span />').append(   // progressBarBack
                                this.#progressBar = $('<span />')  // progressBar
                            )
                        ),                        
                    ),
                    this.#progressMessage = $('<span class="progressMessage" />')
                ).hide()
            ),

            // Error panel
            consoleElement = $('<div class="console"/>')
        )

        this.#editor = new DemoEditor(this, editorElement);
        this.listing = new DemoListing(this.#app, listingElement);
        this.console = new DemoConsole(consoleElement);

        this.#editor.hide();
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
        if (this.listing.tryToShowFolderListing(this.#pathInput.val(), content)) {
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
        this.#progressMessage.text(message);

        this.#block.show();
    }

    /**
     * Call this with statistics to estimate load times.
     */
    setLoadTime(millisPerByte) {
        this.listing.setLoadTime(millisPerByte);
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