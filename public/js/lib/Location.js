/**
 * A set of (x, y) coordinates
 * @memberof Location
 * @typedef {Object} Location
 * @prop {Number} [x=0]  x coordinate on the map
 * @prop {Number} [y=0]  y coordinate on the map
 */

class Location {
    /**
     * Creates a new (x, y) location
     * @constructor
     * @param {Number} [x=0]  x coordinate on the map
     * @param {Number} [y=0]  y coordinate on the map
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }


    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * Returns the location object
     * @type {Location}
     */
    get location() {
        return {
            x: this.x,
            y: this.y
        };
    }

    set location({x=0, y=0}) {
        this.x = x;
        this.y = y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Returns the x coordinate
     * @type {Number}
     */
    get x() {
        return this.x;
    }

    set x(x=0) {
        this.x = y;
        return this.x;
    }

    /**
     * Returns the y coordinate
     * @type {Number}
     */
    get y() {
        return this.y;
    }

    set y(y=0) {
        this.y = y;
        return this.y;
    }


    ///////////
    // Other //
    ///////////

    /**
     * Returns a string of the coordinates in the format "(x, y)"
     * @returns {String}
     */
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

export default Location;
