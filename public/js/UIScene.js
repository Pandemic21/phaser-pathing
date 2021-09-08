import UIHelper from './UIHelper.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init(data) {
        this.eventEmitter = data.eventEmitter;
    }

    preload() {
        // this allows us to get the screen height/width for formulaic UI creation
        this.canvas = this.sys.game.canvas;
    }

    create() {
        /* Contains:
         *    Constants
         *    Bar Creation
         *    Mana Orb Creation
         */

        ///////////////
        // Constants //
        ///////////////

        var self = this;

        // font constants
        const fontSize = 30;
        const fontSizePx = fontSize + "px";
        const startX = 400;
        const startY = 300;
        const pixel_buffer = fontSize * 2;


        //////////////////
        // Bar Creation //
        //////////////////

        // rectangle code
        // max hp rectangle, gold outline with a black background
        let maxHealth = this.add.rectangle(UIHelper.HEALTH_BAR_START_X, UIHelper.HEALTH_BAR_START_Y, UIHelper.HEALTH_BAR_WIDTH, UIHelper.HEALTH_BAR_HEIGHT, UIHelper.COLOR_BLACK);
        maxHealth.setOrigin(0, 0);
        maxHealth.setStrokeStyle(UIHelper.HEALTH_BAR_STROKE_WIDTH, UIHelper.COLOR_GOLD);

        // current hp rectangle
        this.currentHealthValue = 100;

        this.currentHealth = this.add.graphics();
        this.currentHealth.fillStyle(UIHelper.COLOR_HEALTH, 1);
        this.currentHealth.fillRect(UIHelper.HEALTH_BAR_START_X, UIHelper.HEALTH_BAR_START_Y + 100 - this.currentHealthValue, UIHelper.HEALTH_BAR_WIDTH, this.currentHealthValue);


        ///////////////////////
        // Mana Orb Creation //
        ///////////////////////

        // TODO:
        //  for now all mana types (each element)
        //  is hard coded to 3. This can be individually set
        //  so that the player has more of some mana types.
        //  To be decided.
        this.MAX_MANA = 3;
        this.ELEMENT_COLORS = [
            UIHelper.COLOR_ELEMENT_FIRE,
            UIHelper.COLOR_ELEMENT_WATER,
            UIHelper.COLOR_ELEMENT_EARTH,
            UIHelper.COLOR_ELEMENT_AIR,
            UIHelper.COLOR_ELEMENT_LIGHT,
            UIHelper.COLOR_ELEMENT_DARK,
        ];

        // this hold the last version of the players mana
        //  we run a diff between this and the new araray the player sends
        //  in order to cut down on time spent in the update loop.
        //  We take the diff and only update mana orbs that the player has used.
        this.oldCurrentMana = [
            3, /* Fire     */
            3, /* Water    */
            3, /* Earth    */
            3, /* Air      */
            3, /* Light    */
            3 /*  Dark    */
        ];

        // the player's actual current mana, fed from "ClientGameScene.js"
        this.currentMana = [
            3, /* Fire     */
            3, /* Water    */
            3, /* Earth    */
            3, /* Air      */
            3, /* Light    */
            3 /*  Dark    */
        ];

        // should we redraw the mana in the update() loop?
        this.redrawMana = true;

        // map each element to a name (for readability only)
        // for example:
        //  this.currentMana[this.manaData.fire] = this.currentMana[this.manaData.fire] - 3
        this.manaData = new Map();
        this.manaData.fire = 0;
        this.manaData.water = 1;
        this.manaData.earth = 2;
        this.manaData.air = 3;
        this.manaData.light = 4;
        this.manaData.dark = 4;


        this.manaCircles = [
            [], /* Fire     */
            [], /* Water    */
            [], /* Earth    */
            [], /* Air      */
            [], /* Light    */
            [] /* Dark     */
        ];


        // loop through each element color
        for (let k = 0; k < this.ELEMENT_COLORS.length; k++) {

            // for each element color, draw a number of circles
            //  equal to the max amount of mana for that element
            //  (right now all elements are hardcoded to MAX_MANA)
            for (let i = 0; i < this.MAX_MANA; i++) {
                let x = UIHelper.MANA_ORB_START_X + (k * UIHelper.MANA_ORB_BUFFER); // k = outter for loop
                let y = UIHelper.MANA_ORB_START_Y - (i * UIHelper.MANA_ORB_BUFFER); // i = inner for loop

                this.manaCircles[k].push(this.add.circle(x, y, UIHelper.MANA_ORB_RADIUS));
                this.manaCircles[k][i].setStrokeStyle(UIHelper.MANA_ORB_STROKE_WIDTH, UIHelper.COLOR_GOLD);
                this.manaCircles[k][i].setFillStyle(this.ELEMENT_COLORS[k]);
                this.manaCircles[k][i].fullMana = true;
            }
        }
    }


    update() {
        this.eventEmitter.on('changeHp', (health) => {
            if (health !== this.currentHealthValue) {
                this.currentHealth.clear();
                this.currentHealth.fillStyle(UIHelper.COLOR_HEALTH, 1);
                this.currentHealth.fillRect(UIHelper.HEALTH_BAR_START_X, UIHelper.HEALTH_BAR_START_Y + 100 - health, UIHelper.HEALTH_BAR_WIDTH, health);
                this.currentHealthValue = health;
            }
        });

        // create the event emitter
        //  this redraws runes
        this.eventEmitter.on('redrawManaCircles', (currentMana) => {
            if (this.redrawMana) {
                this.redrawManaCircles(currentMana);
            }

        });


    }



    redrawManaCircles(currentMana) {
        // do not redraw the mana until we've completed the current redraw
        this.redrawMana = false;

        // right now, ClientGameScene.js can theoretically give us negative numbers.
        //    handle that.
        for (let k = 0; k < currentMana.length; k++) {
            if (currentMana[k] < 0) {
                currentMana[k] = 0;
            }
        }

        this.currentMana = currentMana;
        this.oldCurrentMana = currentMana;


        // loop through each element color
        for (let k = 0; k < this.ELEMENT_COLORS.length; k++) {
            // get the diff between this.oldCurrentMana and currentMana
            //    if we don't have to redraw the element, skip it.
            if (currentMana[k] != this.oldCurrentMana[k]) {
                console.log('skipping');
                continue;
            }

            // for each element color, draw a number of circles
            //  equal to the max amount of mana for that element
            //  (right now all elements are hardcoded to MAX_MANA)
            let x = UIHelper.MANA_ORB_START_X + (k * UIHelper.MANA_ORB_BUFFER); // k = outter for loop

            for (let i = 0; i < this.MAX_MANA; i++) {
                let y = UIHelper.MANA_ORB_START_Y - (i * UIHelper.MANA_ORB_BUFFER); // i = inner for loop

                // determine if the mana orb is full or empty
                // if the mana orb is full
                if (i < currentMana[k]) {
                    this.manaCircles[k][i].setFillStyle(this.ELEMENT_COLORS[k]);
                    this.manaCircles[k][i].fullMana = true;
                }

                // else, the mana orb is empty
                else {
                    this.manaCircles[k][i].setFillStyle(UIHelper.COLOR_ELEMENT_EMPTY);
                    this.manaCircles[k][i].fullMana = false;
                }

            }
        }

        // set this.oldCurrentMana
        this.oldCurrentMana = currentMana;

        // tell update() to redraw mana if necessary
        this.redrawMana = true;
    }
}
