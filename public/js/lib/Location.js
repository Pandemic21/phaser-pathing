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
        this._x = x;
        this._y = y;
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
            x: this._x,
            y: this._y
        };
    }

    set location({
        x = 0,
        y = 0
    }) {
        this._x = x;
        this._y = y;
    }

    /**
     * Returns the x coordinate
     * @type {Number}
     */
    get x() {
        let x = this._x;
        return x
    }

    set x(x = 0) {
        this._x = x;
    }

    /**
     * Returns the y coordinate
     * @type {Number}
     */
    get y() {
        let y = this._y;
        return y;
    }

    set y(y = 0) {
        this._y = y;
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
