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

class DemoFolderListing {

    #listingElement = null;    
    #loadTimePerByteMillis = 0;
    
    constructor(listingElement) {
        this.#listingElement = listingElement;
    }

    /**
     * If the passed string is a folder listing from PyMidiWrapper, this returns 
     * true after showing the listing. If not, false is returned.
     */
    show(path, content) {
        if (path.slice(-1) != "/") {
            path += "/";
        }

        try {
            const dec = JSON.parse(content);
            if (!dec) return false;
            if (!Array.isArray(dec)) return false;

            for (const entry of dec) {
                if (!(typeof entry[0] == "string")) return false;
                if (!(typeof entry[1] == "boolean")) return false;
                if (!(typeof entry[2] == "number")) return false;
            }
            
            function weight(entry) {
                let ret = 0;
                if (entry[1]) ret += 1000;  // Directory
                return ret;
            }

            dec.sort(function(a, b) {
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

            this.#listingElement.html("");

            this.#listingElement.append(
                $('<div />').text(
                    "Type " + 
                    Tools.fillupString("Size", 10, " ") + " " +
                    Tools.fillupString("ETA", 7, " ") + " " +
                    "Name"
                )
            );

            if (path != "/") {
                const parentPath = this.#getParentPath(path);
                
                this.#listingElement.append(
                    $('<a href="#' + parentPath + '"/>').text(
                        "D    " + 
                        Tools.fillupString("-", 10, " ") + " " +
                        Tools.fillupString("-", 7, " ") + " " + 
                        ".."
                    )
                );
            }

            for (const entry of dec) {
                const filename = entry[0];
                const isDir = !!entry[1];
                
                let text = "F    ";                
                if (isDir) text = "D    ";

                const sizeStr = isDir ? "-" : Tools.formatSize(entry[2]);
                const timeStr = isDir ? "-" : this.#getTimeEstimation(entry[2]);

                text += Tools.fillupString(sizeStr, 10, " ") + " ";
                text += Tools.fillupString(timeStr, 7, " ") + " ";
                text += path + filename;
                
                this.#listingElement.append(
                    $('<a href="#' + path + filename + '"/>').text(text)
                );
            }

            return true;

        } catch (e) {
            //console.log(e)
            return false;
        }
    }

    /**
     * Call this with statistics to estimate load times.
     */
    setLoadTime(millisPerByte) {
        this.#loadTimePerByteMillis = millisPerByte;
    }
    
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