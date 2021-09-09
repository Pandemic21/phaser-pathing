import UIHelper from './UIHelper.js';

export default class SpellCastingScene extends Phaser.Scene {
    /**
     * Creates a new SpellCastingScene.
     *
     * This is called by {@link ClientGameScene}
     *
     * This class handles spell keyboard input (qwerdf, etc...), drawing runes, and other spell calculations.
     * @constructor
     */
    constructor() {
        super();
    }

    init(data) {
        this.eventEmitter = data.eventEmitter;
    }

    preload() {
        // this allows us to get the screen height/width for formulaic UI creation
        this.canvas = this.sys.game.canvas;

        this.load.json('spells', './js/lib/spells.json');

        /* From Rex UI
         *    Source:
         *        https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-buttons/
         *        https://codepen.io/rexrainbow/pen/eYvxqLJ?editors=1010
         */
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }


    ////////////
    // Create //
    ////////////

    create() {
        /* Contains:
         *    Constants
         *    Event Emitters
         *    Rune Slots
         *
         */

        ///////////////
        // Constants //
        ///////////////

        this.SCENE_KEY_CURRENT = 'spellCastingScene'; // current scene key (from 'client.js')
        this.SPELLS = this.cache.json.get('spells');

        this.uiHelper = new UIHelper();

        // map each element to a name (for readability only)
        // for example:
        //  this.currentMana[this.manaData.fire] = this.currentMana[this.manaData.fire] - 3
        this.manaData = new Map();
        this.manaData.fire = 0;
        this.manaData.water = 1;
        this.manaData.earth = 2;
        this.manaData.air = 3;
        this.manaData.light = 4;
        this.manaData.dark = 5;

        ////////////////////
        // Event Emitters //
        ////////////////////

        /* Function: drawRuneSlots
            Triggered:
                - when player pressed q
        */
        /**
         * drawRuneSlots - This draws the runeslots
         * @function
         * @type {Phaser.Keypress}
         */
        this.eventEmitter.on('drawRuneSlots', (keyPress) => {
            this.drawRuneSlots(keyPress);
        });


        /* Function: drawRuneSlots
            Triggered:
                - when player presses RMB (ClientGameScene.js)
        */
        this.eventEmitter.on('clearRuneSlots', () => {
            this.clearRuneSlots();
        });

        this.eventEmitter.on('calculateSpell', () => {
            this.calculateSpell();
        });

        console.log('here');


        ////////////////
        // Rune Slots //
        ////////////////

        this.redrawRunes = false; // if this is true, the update() loop redraws the runes
        this.activeSlot = 0; // slot the player is currently using, 3 slots total (0-2)
        this.isDrawingRune = false; // this locks drawing new runes until the current rune has been drawn
        this.runeSlots = [];
        this.manaRequirements = [0, 0, 0, 0, 0, 0]; // this is passed to ClientGameScene.js and eventually server.js

        for (let k = 0; k < 3; k++) {
            this.runeSlots.push(
                this.add.rectangle(
                    this.uiHelper.RUNE_SLOT.location.x + ((k + 1) * this.uiHelper.RUNE_SLOT.size.width),
                    this.uiHelper.RUNE_SLOT.location.y,
                    this.uiHelper.RUNE_SLOT.size.width,
                    this.uiHelper.RUNE_SLOT.size.height,
                    this.uiHelper.RUNE_SLOT_COLORS.fillColor));

            this.runeSlots[k].setStrokeStyle(5, this.uiHelper.RUNE_SLOT_COLORS.strokeColor);
            this.runeSlots[k].fillColor = this.uiHelper.RUNE_SLOT_COLORS.fillColor;
            this.runeSlots[k].element = '';
        }

        console.log('there');
        console.log(this.runeSlots);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////
    // Update //
    ////////////

    update() {
        // redraw the runeSlots
        if (this.redrawRunes) {
            // update each of the rule slots (with element/color)
            for (let k = 0; k < 3; k++) {
                this.runeSlots[k].fillColor = this.runeSlots[k].fillColor;
            }

            // do not redraw the runes next update()
            this.redrawRunes = false;
        }
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    /* Function: drawRuneSlots(keyPress)
        Parameters:
            keyPress - Phaser object from ClientGameScene, contains the key that was pressed
        Trigged:
            by ClientGameScene when the user presses a key
    */

    /**
     * drawRuneSlots - Redraws the runeslots on the player UI
     * @param  {Phaser.Keypress } keyPress               The key that was pressed (Phaser object)
     * @return {Boolean }          Returns `false` if the runes did not redraw (already being redrawn)
     */
    drawRuneSlots(keyPress) {
        // if we're already drawing another rune, return false.
        if (this.isDrawingRune) {
            return false;
        }

        // if the active slot is 2 they've already selected 3 runes, stop
        if (this.activeSlot > 2) {
            return false;
        }

        // we're currently drawing a rune, lock this.
        this.isDrawingRune = true;

        // draw the element in runeSlots[activeSlot] based on keypress
        // q = fire
        // w = water
        // e = earth
        // r = air
        // d = light
        // f = dark

        // q = fire
        if (keyPress.key == 'q') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_FIRE;
            this.runeSlots[this.activeSlot].element = 'fire';
            this.manaRequirements[this.manaData.fire] = this.manaRequirements[this.manaData.fire] + 1;
        } else if (keyPress.key == 'w') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_WATER;
            this.runeSlots[this.activeSlot].element = 'water';
            this.manaRequirements[this.manaData.water] = this.manaRequirements[this.manaData.water] + 1;
        } else if (keyPress.key == 'e') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_EARTH;
            this.runeSlots[this.activeSlot].element = 'earth';
            this.manaRequirements[this.manaData.earth] = this.manaRequirements[this.manaData.earth] + 1;
        } else if (keyPress.key == 'r') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_AIR;
            this.runeSlots[this.activeSlot].element = 'air';
            this.manaRequirements[this.manaData.air] = this.manaRequirements[this.manaData.air] + 1;

        } else if (keyPress.key == 'd') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_LIGHT;
            this.runeSlots[this.activeSlot].element = 'light';
            this.manaRequirements[this.manaData.light] = this.manaRequirements[this.manaData.light] + 1;
        } else if (keyPress.key == 'f') {
            this.runeSlots[this.activeSlot].fillColor = UIHelper.COLOR_ELEMENT_DARK;
            this.runeSlots[this.activeSlot].element = 'dark';
            this.manaRequirements[this.manaData.dark] = this.manaRequirements[this.manaData.dark] + 1;
        }

        // incease activeSlot and tell update() to redraw
        this.activeSlot++;
        this.redrawRunes = true;
        this.isDrawingRune = false;
    }

    clearRuneSlots() {
        this.runeSlots.forEach((runeSlot) => {
            runeSlot.fillColor = UIHelper.RUNE_SLOT_FILL_COLOR;
            runeSlot.element = '';
        });

        this.manaRequirements = [0, 0, 0, 0, 0, 0];
        this.redrawRunes = true;
        this.activeSlot = 0;
    }

    /*  Function: calculateSpell()
        Triggers:
            when the player presses {spacebar}, from ClientGameScene.js
        Results:
            takes the rune(s) the player has input and determines the spell to cast
    */
    calculateSpell() {
        // if they input fewer than 3 elements the spell is invalid, return false
        if (this.runeSlots[2].element == '') {
            return false;
        }

        // reset the current spell the player is casting
        // this looks at 'spells.json'
        this.spell = this.SPELLS[this.runeSlots[0].element][this.runeSlots[1].element][this.runeSlots[2].element];

        // tell the client if they cast a valid spell or not
        if (this.spell != '') {
            this.eventEmitter.emit('primeSpell', this.spell, this.manaRequirements);
            this.clearRuneSlots();
            return true;
        } else {
            this.clearRuneSlots();
            return false;
        }
    }
}