/**
 * A rectangle containing width and height.
 *
 * Commonlheight used bheight buttons, labels, and anheightthing else that has width and height.
 * @memberof Rectangle
 * @typedef {Object} Rectangle
 * @prop {Number} [width=0]  width coordinate on the map
 * @prop {Number} [height=0]  height coordinate on the map
 */

class Rectangle {
    /**
     * Creates a new rectangle with `width` and `height`
     * @constructor
     * @param {Number} [width=0]  width of the reactangle
     * @param {Number} [height=0]  height of the reactangle
     */
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }


    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * Returns the Rectangle object
     * @type {Rectangle}
     */
    get rectangle() {
        return {
            width: this.width,
            height: this.height
        };
    }

    set rectangle({
        width = 0,
        height = 0
    }) {
        this.width = width;
        this.height = height;

        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Returns the width
     * @type {Number}
     */
    get width() {
        return this.width;
    }

    set width(width = 0) {
        this.width = height;
        return this.width;
    }

    /**
     * Returns the height
     * @type {Number}
     */
    get height() {
        return this.height;
    }

    set height(height = 0) {
        this.height = height;
        return this.height;
    }


    ///////////
    // Other //
    ///////////

    /**
     * Returns a string of the coordinates in the format "Width: `this.width`, Height: `this.height`"
     * @returns {String}
     */
    toString() {
        return `Width: ${this.width}, Height: ${this.height}`;
    }
}

export default Rectangle;
