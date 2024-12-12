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

class DemoListing {

    #app = null;
    #listingElement = null;    
    #loadTimePerByteMillis = 0;
    
    constructor(app, listingElement) {
        this.#app = app;
        this.#listingElement = listingElement;
    }

    /**
     * If the passed string is a folder listing from PyMidiWrapper, this returns 
     * true after showing the listing. If not, false is returned.
     */
    tryToShowFolderListing(path, content) {
        if (path.slice(-1) != "/") {
            path += "/";
        }

        try {
            // Parse and check data in advance
            const dec = JSON.parse(content);
            this.#checkData(dec);
            
            // Sort
            this.#sortData(dec);

            // Build DOM
            this.#buildFolderListingDom(dec, path);

            return true;

        } catch (e) {
            //console.log(e)
            return false;
        }
    }

    /**
     * Clear contents
     */
    clear() {
        this.#listingElement.html("");
    }

    /**
     * Just show a message
     */
    message(msg) {
        this.#listingElement.append(
            $('<div />').text(msg)
        ); 
    }

    /**
     * Shows port as returned by the Midi handler.
     */
    showPort(port) {
        const link = this.#app.getContentUrl(port.name, "/");
            
        this.#listingElement.append(
            $('<a href="#' + link + '"/>').text(port.name)
        );
    }

    /**
     * Build DOM for folder listing
     */
    #buildFolderListingDom(data, path) {
        this.clear();

        // Port name
        this.#addPortName();

        // Header
        this.#addHeader(path);

        // Parent directory (..)
        if (path != "/") {
            this.#addParentFolderLink(path);
        }

        // Files and folders
        for (const entry of data) {
            this.#addFileLink(entry, path);
        }
    }

    /**
     * Add port name
     */
    #addPortName() {
        this.#listingElement.append(
            $('<div />').text("Connected to: " + this.#app.portName()),
            $('<a href="#ports"/>').text("Show all available devices..."),
            $('<div />'),
        ); 
    }

    /**
     * Add folder listing header
     */
    #addHeader(path) {
        this.#listingElement.append(
            $('<div />').text("Contents of " + path),
            $('<div />'),
            $('<div />').text(
                "Type " + 
                Tools.fillupString("Size", 10, " ") + " " +
                Tools.fillupString("ETA", 7, " ") + " " +
                "Name"
            )
        );
    }

    /**
     * Add parent folder link
     */
    #addParentFolderLink(path) {
        const parentPath = this.#app.getContentUrl(null, this.#getParentPath(path));
            
        this.#listingElement.append(
            $('<a href="#' + parentPath + '"/>').text(
                "D    " + 
                Tools.fillupString("-", 10, " ") + " " +
                Tools.fillupString("-", 7, " ") + " " + 
                ".."
            )
        );
    }

    /**
     * Add file link
     */
    #addFileLink(entry, path) {
        const filename = entry[0];
        const isDir = !!entry[1];
        
        // Build text
        let text = "F    ";                
        if (isDir) text = "D    ";

        const sizeStr = isDir ? "-" : Tools.formatSize(entry[2]);
        const timeStr = isDir ? "-" : this.#getTimeEstimation(entry[2]);

        text += Tools.fillupString(sizeStr, 10, " ") + " ";
        text += Tools.fillupString(timeStr, 7, " ") + " ";
        text += filename;

        const href = this.#app.getContentUrl(null, path + filename);

        this.#listingElement.append(
            $('<a href="#' + href + '"/>').text(text)
        );
    }

    /**
     * Checks the data whether it is a folder listing or not. Throws if not.
     */
    #checkData(decoded) {        
        if (!decoded) throw new Error();
        if (!Array.isArray(decoded)) throw new Error();
        
        for (const entry of decoded) {
            if (!Array.isArray(entry)) throw new Error();
            if (entry.length != 3) throw new Error();
            if (!(typeof entry[0] == "string")) throw new Error();
            if (!(typeof entry[1] == "boolean")) throw new Error();
            if (!(typeof entry[2] == "number")) throw new Error();
        }
    }

    /**
     * Sorts the data.
     */
    #sortData(data) {
        // Here we know it is a folder listing. First sort it.
        function weight(entry) {
            let ret = 0;
            if (entry[1]) ret += 1000;  // Directory
            return ret;
        }

        data.sort(function(a, b) {
            const wa = weight(a);
            const wb = weight(b);
            const w = wb - wa;

            const nameA = a[0].toLowerCase();
            const nameB = b[0].toLowerCase();

            if (nameA < nameB) {
                return -1 + w;
              }
              if (nameA > nameB) {
                return 1 + w;
              }
              return w;
        });
    }

    /**
     * Call this with statistics to estimate load times.
     */
    setLoadTime(millisPerByte) {
        this.#loadTimePerByteMillis = millisPerByte;
    }
    
    /**
     * Get the parent path of a file
     */
    #getParentPath(path) {
        const t = path.split("/");
        t.pop();
        t.pop();
        const ret = t.join("/");
        
        return ret ? ret : "/";
    }

    /**
     * Returns a string with a load time estimation.
     */
    #getTimeEstimation(bytes) {
        const time = this.#loadTimePerByteMillis * bytes;
        return Tools.formatTime(time);
    }
}