/**
 * Contains all information necessary for the client to draw status information.
 *
 * This includes stuns, slows, etc...
 *
 * @memberof Status
 * @typedef {Object} Status
 * @prop {Number} gameTime     The gameTime in ms the status took effect
 * @prop {Number} duration     The duration in ms the status lasts
 * @prop {String} label        The label the client should attach to this status
 * @prop {ColorData} colors    The colors to use for the status
 */


import ColorData from './ColorData.js';

class Status {
    /**
     * Creates a new status effect for the client to visually render
     * @example
     * let colors = new ColorData(1, 0xefc53f, 0xbcc947)
     * let stun = new Status(this.gameTime, 2000, "Stunned", colors)
     * @param {Number} gameTime     The gameTime in ms the status initially took effect
     * @param {Number} duration     The duration in ms the status lasts
     * @param {String} label        The label the client should attach to this status
     * @param {ColorData} colors    The color data to use for the status
     */
    constructor(gameTime, duration, label, colors) {
        this.privateGameTime = 0; // gameTime the status started
        this.privateDuration = 0; // duration of status in ms
        this.privateLabel = ''; // what is the status? (e.g. stun, slow, confused, etc...)
        this.privateColors = new ColorData();
    }

    /////////////////////////
    // Getters and Setters //
    /////////////////////////

    /**
     * The gameTime in ms the status initially took effect
     * @return {Number} The gameTime in ms the status initially took effect
     */
    get gameTime() {
        return this.privateGameTime;
    }

    set gameTime(newGameTime) {
        this.privateGameTime = newGameTime;
    }

    /**
     * The duration in ms the status lasts
     * @return {Number} The duration in ms the status lasts
     */
    get duration() {
        return this.privateDuration;
    }

    set duration(newDuration) {
        this.privateDuration = newDuration;
    }

    /**
     * What the status effect is (e.g. stun, slow, confused, etc...)
     * @return {String} What the status effect is (e.g. stun, slow, confused, etc...)
     */
    get label() {
        return this.privateLabel;
    }

    set label(newLabel) {
        this.privateLabel = newLabel;
    }

    /**
     * The color data to use for the status
     * @return {ColorData} The color data to use for the status
     */
    get colorData() {
        return this.privateColors;
    }

    set colorData(newColors) {
        this.privateColors = newColors;
    }
}

export default Status;
