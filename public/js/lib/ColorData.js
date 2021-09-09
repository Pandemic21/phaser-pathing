/**
 * Contains data for the client to color things
 * @memberof ColorData
 * @typedef {Object} ColorData
 * @prop {Number} [strokeWidth=5] The stroke width of the line
 * @prop {Hex} [strokeColor = 0xefc53f] The line stroke color
 * @prop {Hex} [fillColor = 0xbcc947] The shape fill color
 */

class ColorData {
    /**
     * Creates a new circle with a radius
     * @constructor
     * @type {ColorData}
     * @param {Number} [strokeWidth=5] The stroke width of the line
     * @param {Hex} [strokeColor = 0xefc53f] The line stroke color
     * @param {Hex} [fillColor = 0xbcc947] The shape fill color
     */
    constructor(strokeWidth = 5, strokeColor = 0xefc53f, fillColor = 0xbcc947) {
        this.privateStrokeWidth = strokeWidth;
        this.privateStrokeColor = strokeColor;
        this.privateFillColor = fillColor;
    }

    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * Stroke width in pixels
     * @type {Number}
     */
    get strokeWidth() {
        return this.privateStrokeWidth;
    }

    set strokeWidth(strokeWidth) {
        this.privateStrokeWidth = strokeWidth;
    }

    /**
     * Stroke color
     * @type {Hex}
     */
    get strokeColor() {
        return this.privateStrokeColor;
    }

    set strokeColor(strokeColor) {
        this.privateStrokeColor = strokeColor;
    }

    /**
     * Stroke width in pixels
     * @type {Hex}
     */
    get fillColor() {
        return this.privateFillColor;
    }

    set fillColor(fillColor) {
        this.privateFillColor = fillColor;
    }
}

export default ColorData;