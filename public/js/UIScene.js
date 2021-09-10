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
        const fontSizePx = fontSize + 'px';
        const startX = 400;
        const startY = 300;
        const pixelBuffer = fontSize * 2;

        this.uiHelper = new UIHelper();


        //////////////////
        // Bar Creation //
        //////////////////

        // rectangle code
        // max hp rectangle, gold outline with a black background

        let maxHealth = this.add.rectangle(this.uiHelper.HEALTH_BAR.location.x,
            this.uiHelper.HEALTH_BAR.location.y,
            this.uiHelper.HEALTH_BAR.size.width,
            this.uiHelper.HEALTH_BAR.size.height,
            this.uiHelper.UI_COLORS.BLACK);

        maxHealth.setOrigin(0, 0);
        maxHealth.setStrokeStyle(this.uiHelper.HEALTH_BAR.strokeWidth, this.uiHelper.UI_COLORS.GOLD);

        // current hp rectangle
        this.currentHealthValue = 100;

        this.currentHealth = this.add.graphics();
        this.currentHealth.fillStyle(this.uiHelper.UI_COLORS.HEALTH, 1);

        this.currentHealth.fillRect(this.uiHelper.HEALTH_BAR.location.x,
            this.uiHelper.HEALTH_BAR.location.y + 100 - this.currentHealthValue,
            this.uiHelper.HEALTH_BAR.size.width,
            this.currentHealthValue);


        ///////////////////////
        // Mana Orb Creation //
        ///////////////////////

        this.MAX_MANA = 3;

        // this array is used when drawing the mana orbs
        this.ELEMENT_COLORS = [
            this.uiHelper.MANA_COLORS.FIRE,
            this.uiHelper.MANA_COLORS.WATER,
            this.uiHelper.MANA_COLORS.EARTH,
            this.uiHelper.MANA_COLORS.AIR,
            this.uiHelper.MANA_COLORS.LIGHT,
            this.uiHelper.MANA_COLORS.DARK,
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

        // should we redraw the mana in the update loop?
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
        for (let k = 0; k < this.currentMana.length; k++) {
            // for each element color, draw a number of circles
            //  equal to the max amount of mana for that element
            //  (right now all elements are hardcoded to MAX_MANA)
            for (let i = 0; i < this.MAX_MANA; i++) {
                let x = this.uiHelper.MANA_ORB.location.x + (k * this.uiHelper.MANA_ORB.buffer); // k = outter for loop
                let y = this.uiHelper.MANA_ORB.location.y - (i * this.uiHelper.MANA_ORB.buffer); // i = inner for loop

                this.manaCircles[k].push(this.add.circle(x, y, this.uiHelper.MANA_ORB.circle.radius));
                this.manaCircles[k][i].setStrokeStyle(this.uiHelper.MANA_ORB_COLORS.strokeWidth, this.uiHelper.MANA_ORB_COLORS.strokeColor);
                this.manaCircles[k][i].setFillStyle(this.ELEMENT_COLORS[k]);
                this.manaCircles[k][i].fullMana = true;
            }
        }

        /////////////////
        // Casting Bar //
        /////////////////

        this.bigCastingBar = this.add.rectangle(this.uiHelper.CASTING_BAR.x,
            this.uiHelper.CASTING_BAR.y,
            this.uiHelper.CASTING_BAR.bigSize.width,
            this.uiHelper.CASTING_BAR.bigSize.height,
            this.uiHelper.MANA_COLORS.EMPTY);
        this.bigCastingBar.setStrokeStyle(this.uiHelper.CASTING_BAR.colors.strokeWidth, this.uiHelper.CASTING_BAR.colors.strokeColor);

        this.smallCastingBar = this.add.rectangle(this.uiHelper.CASTING_BAR.x,
            this.uiHelper.CASTING_BAR.y,
            this.uiHelper.CASTING_BAR.smallSize.width,
            this.uiHelper.CASTING_BAR.smallSize.height,
            this.uiHelper.CASTING_BAR.colors.fillColor);

        // this is the maximum amount we will tween to, to animate the casting bar
        this.smallCastingBar.maxWidth = this.smallCastingBar.width;
        this.smallCastingBar.width = 0;


        this.eventEmitter.on('changeHp', (health) => {
            if (health !== this.currentHealthValue) {
                this.currentHealth.clear();
                this.currentHealth.fillStyle(this.uiHelper.UI_COLORS.HEALTH, 1);
                this.currentHealth.fillRect(this.uiHelper.HEALTH_BAR.location.x, this.uiHelper.HEALTH_BAR.location.y + 100 - health, this.uiHelper.HEALTH_BAR.size.width, health);
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

        this.eventEmitter.on('startCastingBar', (duration) => {
            this.startCastingBar(duration);
        });
    }


    /////////////////
    // Update Loop //
    /////////////////

    update() {
        // if the casting bar has tweened all the way to 'maxWidth', it's time to reset it
        if(this.smallCastingBar.width == this.smallCastingBar.maxWidth){
            // add a new tween, setting alpha from 1 --> 0 over 200 ms
            this.tweens.add({
                targets: this.smallCastingBar,
                alpha: {
                    value: 0,
                    duration: 225
                }

            });

            // after slightly longer than the tween (important for UX), reset the width and alpha of the small casting bar
            setTimeout(() => {
                this.smallCastingBar.width = 0;
                this.smallCastingBar.alpha = 1;
            }, 300);
        }
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
            let x = this.uiHelper.MANA_ORB.location.x + (k * this.uiHelper.MANA_ORB.buffer); // k = outter for loop

            for (let i = 0; i < this.MAX_MANA; i++) {
                let y = this.uiHelper.MANA_ORB.location.y - (i * this.uiHelper.MANA_ORB_BUFFER); // i = inner for loop

                // determine if the mana orb is full or empty
                // if the mana orb is full
                if (i < currentMana[k]) {
                    this.manaCircles[k][i].setFillStyle(this.ELEMENT_COLORS[k]);
                    this.manaCircles[k][i].fullMana = true;
                }

                // else, the mana orb is empty
                else {
                    this.manaCircles[k][i].setFillStyle(this.uiHelper.MANA_COLORS.EMPTY);
                    this.manaCircles[k][i].fullMana = false;
                }

            }
        }

        // set this.oldCurrentMana
        this.oldCurrentMana = currentMana;

        // tell update() to redraw mana if necessary
        this.redrawMana = true;
    }

    startCastingBar(duration) {
        // stop redrawing the casting bar
        this.resetSmallCastingBar = false;

        // reset the alpha and width, it's set to 0 and maxWidth respectively when the last spell completed
        this.smallCastingBar.alpha = 1;
        this.smallCastingBar.width = 0;

        // add the 'progress bar' tween
        this.tweens.add({
            targets: this.smallCastingBar,
            width: {
                value: this.smallCastingBar.maxWidth,
                duration: duration
            }
        });
    }
}
