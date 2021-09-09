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
        this._strokeWidth = strokeWidth;
        this._strokeColor = strokeColor;
        this._fillColor = fillColor;
    }

    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * Stroke width in pixels
     * @type {Number}
     */
    get strokeWidth() {
        let strokeWidth = this._strokeWidth;
        return strokeWidth;
    }

    set strokeWidth(strokeWidth) {
        this._strokeWidth = strokeWidth;
    }

    /**
     * Stroke color
     * @type {Hex}
     */
    get strokeColor() {
        let strokeColor = this._strokeColor;
        return strokeColor;
    }

    set strokeColor(strokeColor) {
        this._strokeColor = strokeColor;
    }

    /**
     * Stroke width in pixels
     * @type {Hex}
     */
    get fillColor() {
        let fillColor = this._fillColor;
        return fillColor;
    }

    set fillColor(fillColor) {
        this._fillColor = fillColor;
    }
}

export default ColorData;
