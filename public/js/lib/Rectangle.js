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
        this.privateWidth = width;
        this.privateHeight = height;
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
            width: this.privateWidth,
            height: this.privateHeight
        };
    }

    set rectangle({
        width = 0,
        height = 0
    }) {
        this.privateWidth = width;
        this.privateHeight = height;
    }

    /**
     * Returns the width
     * @type {Number}
     */
    get width() {
        return this.privateWidth;
    }

    set width(width = 0) {
        this.privateWidth = width;
    }

    /**
     * Returns the height
     * @type {Number}
     */
    get height() {
        return this.privateHeight;
    }

    set height(height = 0) {
        this.privateHeight = height;
    }


    ///////////
    // Other //
    ///////////

    /**
     * Returns a string of the coordinates in the format "Width: `this.privateWidth`, Height: `this.privateHeight`"
     * @returns {String}
     */
    toString() {
        return `Width: ${this.privateWidth}, Height: ${this.privateHeight}`;
    }
}

export default Rectangle;
