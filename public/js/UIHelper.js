// TODO: verify this import is working
import Location from './lib/Location.js';
import Rectangle from './lib/Rectangle.js';

/**
 * UIHelper Constructor. Sets a bunch of local constants, then uses those local constants to create 'this' objects
 * @class UIHelper
 */
class UIHelper {
    constructor() {
        ////////////
        // Screen //
        ////////////

        const SCREEN_WIDTH = 800;
        const SCREEN_HEIGHT = 600;
        const PIXEL_BUFFER = 20;

        /**
         * The width of the screen, in pixels.
         * > Getter: {@link UIHelper.getScreenWidth}
         * @const
         * @type {Number}
         */
        this.SCREEN_WIDTH = SCREEN_WIDTH;
        /**
         * The height of the screen, in pixels
         * > Getter: {@link UIHelper.getScreenHeight}
         * @const
         * @type {Number}
         */
        this.SCREEN_HEIGHT = SCREEN_HEIGHT;
        /**
         * The amount of pixels to put between objects we draw on the screen
         * @const
         * @type {Number}
         */
        this.PIXEL_BUFFER = PIXEL_BUFFER;


        ///////////
        // Fonts //
        ///////////

        const FONT_SIZE = 30;
        const FONT_SIZE_PX = FONT_SIZE + 'px';
        const FONT_START_X = 230;
        const FONT_START_Y = 130;
        const FONT_PIXEL_BUFFER = FONT_SIZE * 2;
        const FONT_FILL_COLOR = '#0f0';

        /**
         * This object contains all information required for the client use/draw fonts
         * > Getter: {@link UIHelper.getFont}
         * @const
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Object} colors
         * @prop {Hex} colors.fillColor
         * @prop {Number} fontSize
         * @prop {Number} fontSizePx
         * @prop {Number} buffer
         */
        this.FONT = {
            'location': {
                'x': FONT_START_X,
                'y': FONT_START_Y
            },
            'colors': {
                'fillColor': 0x00f000
            },
            'fontSize': FONT_SIZE,
            'fontSizePx': FONT_SIZE + 'px',
            'buffer': FONT_SIZE * 2
        };

        ////////////
        // Colors //
        ////////////

        /**
         * This dictionary stores UI colors
         * > Getter: {@link UIHelper.getUIColors}
         * @const
         * @type {Object.<string, hex>}
         */
        this.UIColors = {
            BLACK: 0x000000,
            HEALTH: 0xf5112f,
            MANA: 0x1212cc,
            PRIMARY: 0x4e342e,
            /** Color: 0x7b5e57 */
            LIGHT: 0x7b5e57,
            DARK: 0x260e04,
            GOLD: 0xefc53f,
            BG_COLOR_GREY: 0x9a9a9a
        };

        /**
         * This dictionary stores mana colors
         * > Getter: {@link UIHelper.getManaColors}
         * @const
         * @type {Object.<string, hex>}
         */
        this.MANA_COLORS = {
            FIRE: 0xff0313,
            WATER: 0x071aeb,
            AIR: 0x37d115,
            EARTH: 0x873905,
            LIGHT: 0xf7e811,
            DARK: 0x000000,
            EMPTY: 0xbfbcbb,
        };

        /////////////
        // Buttons //
        /////////////

        const BUTTON_WIDTH = 120;
        const BUTTON_HEIGHT = 40;

        const BUTTON_START_X = BUTTON_WIDTH / 2;
        const BUTTON_START_Y = BUTTON_HEIGHT / 2;

        /**
         * This object contains all information required for the client to draw the buttons
         * > Getter: {@link UIHelper.getButton}
         * @const
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         */
        this.BUTTON = {
            'location': {
                'x': BUTTON_START_X,
                'y': BUTTON_START_Y
            },
            'size': {
                'width': BUTTON_WIDTH,
                'height': BUTTON_HEIGHT
            }
        };

        // get the back button (x,y)
        const BACK_BUTTON_START_X = (SCREEN_WIDTH / 2 - BUTTON_WIDTH - PIXEL_BUFFER);
        const BACK_BUTTON_START_Y = (SCREEN_HEIGHT - BUTTON_HEIGHT - PIXEL_BUFFER);

        /**
         * This object contains all information required for the client to draw the back button
         * > Getter: {@link UIHelper.getBackButton}
         * @const
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         */
        this.BACK_BUTTON = {
            'location': {
                'x': BACK_BUTTON_START_X,
                'y': BACK_BUTTON_START_Y
            },
            'size': {
                'width': BUTTON_WIDTH,
                'height': BUTTON_HEIGHT
            }
        };


        ////////////////
        // Health Bar //
        ////////////////

        // these variables are used in creating 'this.HEALTH_BAR'
        const HEALTH_BAR_STROKE_WIDTH = 8;
        const HEALTH_BAR_BUFFER = 10 + STROKE_WIDTH;
        const HEALTH_BAR_WIDTH = 100;
        const HEALTH_BAR_HEIGHT = 100;
        const HEALTH_BAR_START_X = HEALTH_BAR_BUFFER;

        // BAR_HEIGHT because we setOrigin(0,0) (e.g. Top Left)
        const HEALTH_BAR_START_Y = this.SCREEN_HEIGHT - HEALTH_BAR_BUFFER - HEALTH_BAR_HEIGHT;

        // create 'this.HEALTH_BAR'

        /**
         * This is all the data needed to draw the health bar
         * > Getter: {@link UIHelper.getHealthBar}
         * @const
         * @type {Object}
         * @prop {Number} strokeWidth
         * @prop {Number} buffer
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         */
        this.HEALTH_BAR = {
            'strokeWidth': HEALTH_BAR_STROKE_WIDTH,
            'buffer': HEALTH_BAR_BUFFER,
            'size': {
                'width': HEALTH_BAR_WIDTH,
                'height': HEALTH_BAR_HEIGHT
            },
            'location': {
                'x': HEALTH_BAR_BUFFER,
                'y': HEALTH_BAR_START_Y
            }
        };


        ////////////////////////////
        // Mana Orbs (all colors) //
        ////////////////////////////

        const MANA_ORB_STROKE_WIDTH = 3;
        const MANA_ORB_RADIUS = 10;
        const MANA_ORB_BUFFER = 20 + MANA_ORB_STROKE_WIDTH + MANA_ORB_RADIUS;

        // place X to the right of the health bar
        // place Y to the bottom of the screen, with buffer
        const MANA_ORB_START_X = HEALTH_BAR_START_X + HEALTH_BAR_WIDTH + HEALTH_BAR_STROKE_WIDTH + HEALTH_BAR_BUFFER;
        const MANA_ORB_START_Y = SCREEN_HEIGHT - HEALTH_BAR_BUFFER - MANA_ORB_STROKE_WIDTH - MANA_ORB_RADIUS;

        /**
         * This object contains all information required for the client to draw the mana orbs
         * > Getter: {@link UIHelper.getManaColors}
         * @const
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Number} strokeWidth
         * @prop {Number} radius
         * @prop {Number} buffer
         */
        this.MANA_ORB = {
            'location': {
                'x': MANA_ORB_START_X,
                'y': MANA_ORB_START_Y
            },
            'strokeWidth': MANA_ORB_STROKE_WIDTH,
            'radius': MANA_ORB_RADIUS,
            'buffer': MANA_ORB_BUFFER,
        };


        ////////////////
        // Rune Slots //
        ////////////////

        const RUNE_SLOT_STROKE_COLOR = 0xefc53f;
        const RUNE_SLOT_FILL_COLOR = 0xbcc947;
        const RUNE_SLOT_WIDTH = 50;
        const RUNE_SLOT_HEIGHT = 50;

        // TODO: verify this pixel buffer looks good
        const RUNE_SLOT_BUFFER = 25;

        // *1.5 because there's 3 rune slots, 1.5 is half.
        const RUNE_SLOT_START_X = (this.SCREEN_WIDTH / 2 - RUNE_SLOT_WIDTH * 1.5);
        const RUNE_SLOT_START_Y = (this.SCREEN_HEIGHT - this.PIXEL_BUFFER);

        /**
         * This object contains all information required for the client to draw the rune slots
         * > Getter: {@link UIHelper.getRuneSlot}
         * @const
         * @type {Object}
         * @prop {Hex} strokeColor
         * @prop {Hex} fillColor
         * @prop {Number} buffer
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         */
        this.RUNE_SLOT = {
            'strokeColor': RUNE_SLOT_STROKE_COLOR,
            'fillColor': RUNE_SLOT_FILL_COLOR,
            'buffer': RUNE_SLOT_BUFFER,
            'size': {
                'width': RUNE_SLOT_WIDTH,
                'height': RUNE_SLOT_HEIGHT,
            },
            'location': {
                'x': RUNE_SLOT_START_X,
                'y': RUNE_SLOT_START_Y
            }
        };
    }


    ///////////////////////////
    // Static Getter methods //
    ///////////////////////////


    /**
     * Called by ClientGameScene.js, returns the screen width
     * @static
     * @function
     * @returns {Number} - Returns {@link UIHelper#SCREEN_WIDTH}
     */
    static get getScreenWidth() {
        return this.SCREEN_WIDTH;
    }

    /**
     * Called by ClientGameScene.js, returns the screen height
     * @static
     * @function
     * @returns {Number} - Returns {@link UIHelper#SCREEN_HEIGHT}
     */
    static get getScreenHeight() {
        return this.SCREEN_HEIGHT;
    }


    ///////////
    // Fonts //
    ///////////

    /**
     * Called by ClientGameScene.js, returns the font object
     * @static
     * @function
     * @returns {Object} - Returns {@link UIHelper#FONT}
     */
    static get getFont() {
        return this.FONT;
    }

    ////////////
    // Colors //
    ////////////

    /**
     * Called by ClientGameScene.js, returns the UI_COLORS dictionary
     * @static
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#UI_COLORS}
     */
    static get getUIColors() {
        return this.UI_COLORS;
    }

    /**
     * Called by ClientGameScene.js, returns the MANA_COLORS dictionary
     * @static
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#MANA_COLORS}
     */
    static get getManaColors() {
        return this.MANA_COLORS;
    }


    /////////////
    // Buttons //
    /////////////

    /**
     * Called by ClientGameScene.js, returns the MANA_COLORS dictionary
     * @static
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#BUTTON}
     */
    static get getButton() {
        return this.BUTTON;
    }

    /**
     * getBackButton - Called by ClientGameScene.js, returns the the back button
     * @static
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#BACK_BUTTON}
     */
    static get getBackButton() {
        return this.BACK_BUTTON;
    }


    ////////////////
    // Health Bar //
    ////////////////

    /**
     * Called by ClientGameScene.js, returns the HEALTH_BAR object
     * @function
     * @returns {Object} - Returns {@link UIHelper#HEALTH_BAR}
     */
    static get getHealthBar() {
        return this.HEALTH_BAR;
    }


    ////////////////////////////
    // Mana Orbs (all colors) //
    ////////////////////////////

    /**
     * Called by ClientGameScene.js, returns the MANA_ORB object
     * @function
     * @returns {Object} - Returns {@link UIHelper#MANA_ORB}
     */
    static get getManaOrb() {
        return this.MANA_ORB;
    }


    ////////////////
    // Rune Slots //
    ////////////////

    /**
     * Called by ClientGameScene.js, returns the RUNE_SLOT object
     * @function
     * @returns {Object} - Returns {@link UIHelper#RUNE_SLOT}
     */
    static get getRuneSlot() {
        return this.RUNE_SLOT;
    }


    //////////////////////
    // Custom Functions //
    //////////////////////
    // TODO: come up with a better name for this section

     /**
      * This sets the background color based on BG_COLOR_GREY in {@link UIHelper#UI_COLORS}
      * @function
      * @param {Phaser.Camera} cameraMain  the player's main camera
      * @returns {Void}
      */
    static setCameraBackgroundColor(cameraMain) {
        cameraMain.backgroundColor.setTo(this.UIColors.BG_COLOR_GREY);
    }

    /**
     *  This takes any Array as a parameter, then returns the same array but shuffled.
     * @function
     * @param {Array} array  the array to shuffle
     * @returns {Array}
     */
    static shuffle(array) {
        var currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }

    /**
     * Creates a back button in the scene parameter
     * > Called by:
     * > {@link MainMenu#create}
     * @function
     * @param  {Phaser.Scene} thisScene - The scene to draw the back button on
     * @param  {Phaser.Scene.Key}  currentSceneKey
     * @param  {Phaser.Scene}  backSceneKey
     * @return {String} - What the mouse is doing to the button (e.g. click, out, over, etc...)
     * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-buttons/
     */
    static createBackButton(thisScene, currentSceneKey, backSceneKey) {
        let backButton = thisScene.rexUI.add.buttons({
            x: UIHelper.BUTTON_BACK_START_X,
            y: UIHelper.BUTTON_BACK_START_Y,
            orientation: 'y',

            buttons: [
                this.createButton(thisScene, 'Back'),
            ],

            space: {
                item: 8
            }
        });
        backButton.layout();
        backButton.on('button.click', (button, index, pointer, event) => {
            console.log(`Click button-${button.text}\n`);

            // disable input
            thisScene.input.stopPropagation();

            // find which button they clicked
            // Clicked: Play Game
            if (button.text == 'Back') {
                console.log('Back button pressed');
                thisScene.scene.start(backSceneKey);
                console.log('currentSceneKey: ' + currentSceneKey);
                console.log('backSceneKey: ' + backSceneKey);
            }
        });

        backButton.on('button.out', () => {
            return 'out'; // this is called when the mouse LEAVES the button (can be used for highlighting)
        });

        backButton.on('button.over', () => {
            return 'over'; // this is called when the mouse ENTERS the button (can be used for highlighting)
        });
    }


    /**
     * Creates a Rex UI button with `text` in `thisScene`
     * @param  {Phaser.Scene } thisScene - The scene to draw the button on
     * @param  {String }  text - The text to put inside the button
     * @return {rexUI.add.label} - Returns a Phaser 3 RexUI label (which the client uses as a button)
     * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-label/
     */
    static createButton(thisScene, text) {
        return thisScene.rexUI.add.label({
            width: UIHelper.BUTTON_WIDTH,
            height: UIHelper.BUTTON_HEIGHT,
            background: thisScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, this.UIColors.LIGHT),
            text: thisScene.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        });
    }

    /**
     * creates Rex UI radio buttons
     * @param  {Phaser.Scene } scene - Phaser scene to draw the radio buttons in
     * @param  {String } text - The text for the radio button
     * @param  {String } name - The name for the Rex UI radio button group
     * @return {rexUI.add.label } - The radio button as a Rex UI label
     * @see @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-label/
     */
    static createRadioButton(scene, text, name) {
        if (name === undefined) {
            name = text;
        }
        let button = scene.rexUI.add.label({
            width: 100,
            height: 40,
            text: scene.add.text(0, 0, text, {
                fontSize: 18
            }),
            icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, UIHelper.COLOR_DARK),
            space: {
                left: 10,
                right: 10,
                icon: 10
            },

            name: name,
        });

        return button;
    }
}

export default UIHelper;
