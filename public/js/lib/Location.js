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
        this.privateX = x;
        this.privateY = y;
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
            x: this.privateX,
            y: this.privateY
        };
    }

    set location({x=0, y=0}) {
        this.privateX = x;
        this.privateY = y;

        return {
            x: this.privateX,
            y: this.privateY
        };
    }

    /**
     * Returns the x coordinate
     * @type {Number}
     */
    get x() {
        return this.privateX;
    }

    set x(x=0) {
        this.privateX = x;
    }

    /**
     * Returns the y coordinate
     * @type {Number}
     */
    get y() {
        return this.privateY;
    }

    set y(y=0) {
        this.privateY = y;
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
