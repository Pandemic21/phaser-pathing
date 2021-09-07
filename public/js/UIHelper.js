/**
 * UIHelper Constructor. Sets a bunch of local constants, then uses those local constants to create "this" objects
 * @module UIHelper
 */
module.exports = class UIHelper {
    /**
     *
     * @constructor
     * @memberOf module:UIHelper
     */
    constructor() {
        ////////////
        // Screen //
        ////////////

        const SCREEN_WIDTH = 800;
        const SCREEN_HEIGHT = 600;
        const PIXEL_BUFFER = 20;

        /**
         * The width of the screen, in pixels
         * @type {Number}
         */
        this.SCREEN_WIDTH = SCREEN_WIDTH;
        /**
         * The height of the screen, in pixels
         * @type {Number}
         */
        this.SCREEN_HEIGHT = SCREEN_HEIGHT;
        /**
         * The amount of pixels to put between objects we draw on the screen
         * @type {Number}
         */
        this.PIXEL_BUFFER = PIXEL_BUFFER;


        ///////////
        // Fonts //
        ///////////

        const FONT_SIZE = 30;
        const FONT_SIZE_PX = FONT_SIZE + "px";
        const FONT_START_X = 230;
        const FONT_START_Y = 130;
        const FONT_PIXEL_BUFFER = FONT_SIZE * 2;
        const FONT_FILL_COLOR = '#0f0';

        /**
         * This object contains all information required for the client use/draw fonts
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
            "location": {
                "x": FONT_START_X,
                "y": FONT_START_Y
            },
            "colors": {
                "fillColor": 0x00f000
            },
            "fontSize": FONT_SIZE,
            "fontSizePx": FONT_SIZE + "px",
            "buffer": FONT_SIZE * 2
        };

        /**
         * The default font size
         * @type {Number}
         */
        this.FONT_SIZE = 30;
        /**
         * [The default font size]{@link module:UIHelper#FONT_SIZE} with "px" appended (some functions require a string with px at the end)
         * @type {String}
         */
        this.FONT_SIZE_PX = this.FONT_SIZE + "px";
        /**
         * Starting x coordinate
         * @type {Number}
         */
        this.START_X = 230;
        /**
         * Starting y coordinate
         * @type {Number}
         */
        this.START_Y = 130;
        /**
         * The amount of pixels to put between words (derived from [the default font size]{@link module:UIHelper#FONT_SIZE} )
         * @type {Number}
         */
        this.FONT_PIXEL_BUFFER = this.FONT_SIZE * 2;
        /**
         * The font fill color
         * @type {Hex}
         */
        this.FILL_COLOR = '#0f0';

        ////////////
        // Colors //
        ////////////

        /**
         * This dictionary stores UI colors
         * @type {Object.<string, hex>}
         */
        this.UI_COLORS = {
            BLACK: 0x000000,
            HEALTH: 0xf5112f,
            MANA: 0x1212cc,
            PRIMARY: 0x4e342e,
            LIGHT: 0x7b5e57,
            DARK: 0x260e04,
            GOLD: 0xefc53f,
            BG_COLOR_GREY: 0x9a9a9a
        };

        /**
         * This dictionary stores mana colors
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
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         */
        this.BUTTON = {
            "location": {
                "x": BUTTON_START_X,
                "y": BUTTON_START_Y
            },
            "size": {
                "width": BUTTON_WIDTH,
                "height": BUTTON_HEIGHT
            }
        };


        const BACK_BUTTON_START_X = (SCREEN_WIDTH / 2 - BUTTON_WIDTH - PIXEL_BUFFER);
        const BACK_BUTTON_START_Y = (SCREEN_HEIGHT - BUTTON_HEIGHT - PIXEL_BUFFER);

        /**
         * This object contains all information required for the client to draw the back button
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Object} size
         * @prop {Number} size.width
         * @prop {Number} size.height
         */
        this.BACK_BUTTON_LOCATION = {
            "location": {
                "x": BACK_BUTTON_START_X,
                "y": BACK_BUTTON_START_Y
            },
            "size": {
                "width": BUTTON_WIDTH,
                "height": BUTTON_HEIGHT
            }
        };


        ////////////////
        // Health Bar //
        ////////////////

        // these variables are used in creating "this.HEALTH_BAR"
        const HEALTH_BAR_STROKE_WIDTH = 8;
        const HEALTH_BAR_BUFFER = 10 + STROKE_WIDTH;
        const HEALTH_BAR_WIDTH = 100;
        const HEALTH_BAR_HEIGHT = 100;
        const HEALTH_BAR_START_X = HEALTH_BAR_BUFFER;

        // BAR_HEIGHT because we setOrigin(0,0) (e.g. Top Left)
        const HEALTH_BAR_START_Y = this.SCREEN_HEIGHT - HEALTH_BAR_BUFFER - HEALTH_BAR_HEIGHT;

        // create "this.HEALTH_BAR"

        /**
         * This is all the data needed to draw the health bar
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
            "strokeWidth": HEALTH_BAR_STROKE_WIDTH,
            "buffer": HEALTH_BAR_BUFFER,
            "size": {
                "width": HEALTH_BAR_WIDTH,
                "height": HEALTH_BAR_HEIGHT
            },
            "location": {
                "x": HEALTH_BAR_BUFFER,
                "y": HEALTH_BAR_START_Y
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
         * @type {Object}
         * @prop {Object} location
         * @prop {Number} location.x
         * @prop {Number} location.y
         * @prop {Number} strokeWidth
         * @prop {Number} radius
         * @prop {Number} buffer
         */
        this.MANA_ORB = {
            "location": {
                "x": MANA_ORB_START_X,
                "y": MANA_ORB_START_Y
            },
            "strokeWidth": MANA_ORB_STROKE_WIDTH,
            "radius": MANA_ORB_RADIUS,
            "buffer": MANA_ORB_BUFFER,
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
            "strokeColor": RUNE_SLOT_STROKE_COLOR,
            "fillColor": RUNE_SLOT_FILL_COLOR,
            "buffer": RUNE_SLOT_BUFFER,
            "size": {
                "width": RUNE_SLOT_WIDTH,
                "height": RUNE_SLOT_HEIGHT,
            },
            "location": {
                "x": RUNE_SLOT_START_X,
                "y": RUNE_SLOT_START_Y
            }
        };
    }


    ///////////////////////////
    // Static Getter methods //
    ///////////////////////////


    /** Returns {@link module:UIHelper#SCREEN_WIDTH} */
    static get SCREEN_WIDTH() {
        return this.SCREEN_WIDTH;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get SCREEN_HEIGHT() {
        return this.SCREEN_HEIGHT;
    }


    ///////////
    // Fonts //
    ///////////

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get FONT_SIZE() {
        return this.FONT_SIZE;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get FONT_SIZE_PX() {
        return this.FONT_SIZE_PX;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get START_X() {
        return this.START_X;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get START_Y() {
        return this.START_Y;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get PIXEL_BUFFER() {
        return this.PIXEL_BUFFER;
    }

    /** Returns {@link module:UIHelper#SCREEN_HEIGHT} */
    static get FILL_COLOR() {
        return this.FILL_COLOR;
    }

    ////////////
    // Colors //
    ////////////


    static get UI_COLOR() {
        return this.UI_COLORS;
    }

    static get MANA_COLOR() {
        return this.MANA_COLORS;
    }


    /////////////
    // Buttons //
    /////////////

    static get BUTTON_SIZE() {
        return this.BUTTON_SIZE;
    }

    static get BUTTON_START_LOCATION() {
        return this.BUTTON_START_LOCATION;
    }

    static get BACK_BUTTON_LOCATION() {
        return this.BACK_BUTTON_LOCATION;
    }




    ////////////////
    // Health Bar //
    ////////////////

    static get HEALTH_BAR() {
        return this.HEALTH_BAR;
    }


    ////////////////////////////
    // Mana Orbs (all colors) //
    ////////////////////////////

    static get MANA_ORB() {
        return this.MANA_ORB;
    }


    ////////////////
    // Rune Slots //
    ////////////////

    static get RUNE_SLOT() {
        return this.RUNE_SLOT;
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    static setCameraBackgroundColor(cameraMain) {
        cameraMain.backgroundColor.setTo(this.BG_COLOR_GREY[0], this.BG_COLOR_GREY[1], this.BG_COLOR_GREY[2]);
    }


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

    /* Function: createBackButton
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
            if (button.text == "Back") {
                console.log('Back button pressed');
                thisScene.scene.start(backSceneKey);
                console.log("currentSceneKey: " + currentSceneKey);
                console.log("backSceneKey: " + backSceneKey);
            }
        });

        backButton.on('button.out', () => {
            return; // this is called when the mouse LEAVES the button (can be used for highlighting)
        });

        backButton.on('button.over', () => {
            return; // this is called when the mouse ENTERS the button (can be used for highlighting)
        });
    }


    /* Function: createButton
     */
    static createButton(thisScene, text) {
        return thisScene.rexUI.add.label({
            width: UIHelper.BUTTON_WIDTH,
            height: UIHelper.BUTTON_HEIGHT,
            background: thisScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, UIHelper.COLOR_LIGHT),
            text: thisScene.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        });
    }


    /* Function: createButton
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
};
