// TODO: verify this import is working
import Location from './lib/Location.js';
import Rectangle from './lib/Rectangle.js';
import Circle from './lib/Circle.js';
import ColorData from './lib/ColorData.js';

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
         * A `Rectangle` representing the screen width/height
         * @const
         * @type {Rectangle}
         */
        this.SCREEN = new Rectangle(SCREEN_WIDTH, SCREEN_HEIGHT);

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
         * @const
         * @type {Object.<string, hex>}
         */
        this.UI_COLORS = {
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

        const BUTTON_RECT = new Rectangle(120, 40);
        const BUTTON_START_LOC = new Location(BUTTON_RECT.width / 2, BUTTON_RECT.height / 2);

        /**
         * This object contains all information required for the client to draw the buttons
         * @const
         * @type {Object}
         * @prop {Location} location
         * @prop {Rectangle} size
         */
        this.BUTTON = {
            'location': BUTTON_START_LOC,
            'size': BUTTON_RECT
        };

        // get the back button (x,y)
        const BACK_BUTTON_RECT = new Rectangle(120, 40);
        const BACK_BUTTON_START_LOC = new Location(SCREEN_WIDTH / 2 - BUTTON_RECT.width - PIXEL_BUFFER, SCREEN_HEIGHT - BUTTON_RECT.height - PIXEL_BUFFER);

         /**
          * This object contains all information required for the client to draw the back button
          * @const
          * @type {Object}
          * @prop {Location} location
          * @prop {Rectangle} size
          */
        this.BACK_BUTTON = {
            'location': BACK_BUTTON_START_LOC,
            'size': BACK_BUTTON_RECT
        };


        ////////////////
        // Health Bar //
        ////////////////

        // these variables are used in creating 'this.HEALTH_BAR'
        const HEALTH_BAR_STROKE_WIDTH = 8;
        const HEALTH_BAR_BUFFER = 10 + HEALTH_BAR_STROKE_WIDTH;

        const HEALTH_BAR_RECT = new Rectangle(40, 100);

        // BAR_HEIGHT y coord calculated this way because we setOrigin(0,0) (e.g. Top Left)
        const HEALTH_BAR_START_X = HEALTH_BAR_BUFFER;
        const HEALTH_BAR_START_Y = this.SCREEN.height - HEALTH_BAR_BUFFER - HEALTH_BAR_RECT.height;
        const HEALTH_BAR_LOC = new Location(HEALTH_BAR_START_X, HEALTH_BAR_START_Y);

        /**
         * This is all the data needed to draw the health bar
         * @const
         * @type {Object}
         * @prop {Number} strokeWidth
         * @prop {Number} buffer
         * @prop {Rectangle} size
         * @prop {Location} location
         */
        this.HEALTH_BAR = {
            'strokeWidth': HEALTH_BAR_STROKE_WIDTH,
            'buffer': HEALTH_BAR_BUFFER,
            'size': HEALTH_BAR_RECT,
            'location': HEALTH_BAR_LOC
        };


        ////////////////////////////
        // Mana Orbs (all colors) //
        ////////////////////////////

        const MANA_ORB_STROKE_WIDTH = 3;
        const MANA_ORB_CIRC = new Circle(10);

        // const MANA_ORB_RADIUS = 10;
        const MANA_ORB_BUFFER = 20 + MANA_ORB_STROKE_WIDTH + MANA_ORB_CIRC.radius;

        // place X to the right of the health bar
        // place Y to the bottom of the screen, with buffer
        const MANA_ORB_START_X = HEALTH_BAR_START_X + HEALTH_BAR_RECT.width + HEALTH_BAR_STROKE_WIDTH + HEALTH_BAR_BUFFER;
        const MANA_ORB_START_Y = SCREEN_HEIGHT - HEALTH_BAR_BUFFER - MANA_ORB_STROKE_WIDTH - MANA_ORB_CIRC.radius;

        const MANA_ORB_START_LOC = new Location(MANA_ORB_START_X, MANA_ORB_START_Y);

        /**
         * This object contains all information required for the client to draw the mana orbs
         * @const
         * @type {Object}
         * @prop {Location} location
         * @prop {Number} strokeWidth
         * @prop {Circle} circle
         * @prop {Number} buffer
         */
        this.MANA_ORB = {
            'location': MANA_ORB_START_LOC,
            'strokeWidth': MANA_ORB_STROKE_WIDTH,
            'circle': MANA_ORB_CIRC,
            'buffer': MANA_ORB_BUFFER,
        };

        this.MANA_ORB_COLORS = new ColorData(MANA_ORB_STROKE_WIDTH, this.UI_COLORS.GOLD, this.UI_COLORS.GOLD);


        ////////////////
        // Rune Slots //
        ////////////////

        const RUNE_SLOT_COLORS = new ColorData(0, 0xefc53f, 0xbcc947);

        /**
         * Holds color data for the rune slots
         * @type {ColorData}
         */
        this.RUNE_SLOT_COLORS = RUNE_SLOT_COLORS;
        // const RUNE_SLOT_STROKE_COLOR = 0xefc53f;
        // const RUNE_SLOT_FILL_COLOR = 0xbcc947;

        const RUNE_SLOT_WIDTH = 50;
        const RUNE_SLOT_HEIGHT = 50;
        const RUNE_SLOT_RECT = new Rectangle(RUNE_SLOT_WIDTH, RUNE_SLOT_HEIGHT);

        // TODO: verify this pixel buffer looks good
        const RUNE_SLOT_BUFFER = 25;

        // *1.5 because there's 3 rune slots, 1.5 is half.
        const RUNE_SLOT_START_X = (this.SCREEN_WIDTH / 2 - RUNE_SLOT_WIDTH * 1.5);
        const RUNE_SLOT_START_Y = (this.SCREEN_HEIGHT - this.PIXEL_BUFFER);

        const RUNE_SLOT_START_LOC = new Location(RUNE_SLOT_START_X, RUNE_SLOT_START_Y);

        /**
         * This object contains all information required for the client to draw the rune slots
         * > Getter: {@link UIHelper.getRuneSlot}
         * @const
         * @type {Object}
         * @prop {Hex} strokeColor
         * @prop {Hex} fillColor
         * @prop {Number} buffer
         * @prop {Object} size
         * @prop {Location} location
         */
        this.RUNE_SLOT = {
            'colors': RUNE_SLOT_COLORS,
            'buffer': RUNE_SLOT_BUFFER,
            'size': RUNE_SLOT_RECT,
            'location': RUNE_SLOT_START_LOC
        };
    }

    ///////////////////////////
    // Static Getter methods //
    ///////////////////////////


    /**
     * Called by ClientGameScene.js, returns the screen as a `Rectangle`
     * @function
     * @returns {Rectangle} - Returns {@link UIHelper#SCREEN}
     */
    static get SCREEN() {
        return this.SCREEN;
    }



    ///////////
    // Fonts //
    ///////////

    /**
     * Called by ClientGameScene.js, returns the font object
     * @function
     * @returns {Object} - Returns {@link UIHelper#FONT}
     */
    static get FONT() {
        return this.FONT;
    }

    ////////////
    // Colors //
    ////////////

    /**
     * Called by ClientGameScene.js, returns the UI_COLORS dictionary
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#UI_COLORS}
     */
    static get UI_COLORS() {
        return this.UI_COLORS;
    }

    /**
     * Called by ClientGameScene.js, returns the MANA_COLORS dictionary
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#MANA_COLORS}
     */
    static get MANA_COLORS() {
        return this.MANA_COLORS;
    }


    /////////////
    // Buttons //
    /////////////

    /**
     * Called by ClientGameScene.js, returns the MANA_COLORS dictionary
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#BUTTON}
     */
    static get BUTTON() {
        return this.BUTTON;
    }

    /**
     * getBackButton - Called by ClientGameScene.js, returns the the back button
     * @function
     * @returns {Object.<string, hex>} - Returns {@link UIHelper#BACK_BUTTON}
     */
    static get BACK_BUTTON() {
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
    static get HEALTH_BAR() {
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
    static get MANA_ORB() {
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
    static get RUNE_SLOT() {
        return this.RUNE_SLOT;
    }


    //////////////////////
    // Custom Functions //
    //////////////////////
    // FIXME: come up with a better name for this section

     /**
      * This sets the background color based on BG_COLOR_GREY in {@link UIHelper#UI_COLORS}
      * @function
      * @param {Phaser.Camera} cameraMain  the player's main camera
      * @returns {Void}
      */
    setCameraBackgroundColor(cameraMain) {
        cameraMain.backgroundColor.setTo(this.UI_COLORS.BG_COLOR_GREY);
    }

    /**
     *  This takes any Array as a parameter, then returns the same array but shuffled.
     * @function
     * @param {Array} array  the array to shuffle
     * @returns {Array}
     */
    shuffle(array) {
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
    createBackButton(thisScene, currentSceneKey, backSceneKey) {
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
    createButton(thisScene, text) {
        return thisScene.rexUI.add.label({
            width: UIHelper.BUTTON_WIDTH,
            height: UIHelper.BUTTON_HEIGHT,
            background: thisScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, this.UI_COLORS.LIGHT),
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
     * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-label/
     */
    createRadioButton(scene, text, name) {
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
