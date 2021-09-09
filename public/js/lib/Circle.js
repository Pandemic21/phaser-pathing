/**
 * Contins a radius, plus lots of circle methods
 * @memberof Circle
 * @typedef {Object} Circle
 * @prop {Number} [radius=1] Radius of the circle
 */

class Circle {
    /**
     * Creates a new circle with a radius
     * @constructor
     * @param {Number} [radius=1]  radius of the circle
     */
    constructor(radius = 1) {
        this.privateRadius = radius;
    }

    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * Returns the location object
     * @type {Number}
     */
    get radius() {
        return this.privateRadius;
    }

    set radius(radius) {
        this.privateRadius = radius;
    }

    /**
     * Returns the area of the circle
     * @type {Number}
     */
    get area() {
        return Math.PI * this.privateRadius * this.privateRadius;
    }
}

export default Circle;