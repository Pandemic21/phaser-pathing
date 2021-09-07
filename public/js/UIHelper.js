export default class UIHelper {
    constructor() {
        ////////////
        // Screen //
        ////////////

        this.SCREEN_WIDTH = 800;
        this.SCREEN_HEIGHT = 600;
        this.PIXEL_BUFFER = 20;


        ///////////
        // Fonts //
        ///////////

        this.FONT_SIZE = 30;
        this.FONT_SIZE_PX = this.FONT_SIZE + "px";
        this.START_X = 230;
        this.START_Y = 130;
        this.PIXEL_BUFFER = this.FONT_SIZE * 2;
        this.FILL_COLOR = '#0f0';

        ////////////
        // Colors //
        ////////////

        /**
         * This dictionary contains the colors drawn on the client's screen
         * @type {Object.<string, number>}
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

        /** UI button height/width */
        this.BUTTON_SIZE = {
            "WIDTH": 120,
            "HEIGHT": 40
        };

        this.BUTTON_START_LOCATION = {
            "x": (this.BUTTON_SIZE.WIDTH / 2),
            "y": (this.BUTTON_SIZE.HEIGHT / 2)
        };

        this.BACK_BUTTON_LOCATION = {
            "x": (this.SCREEN_WIDTH / 2 - this.BUTTON_SIZE.WIDTH - this.PIXEL_BUFFER),
            "y": (this.SCREEN_HEIGHT - this.BUTTON_SIZE.HEIGHT - this.PIXEL_BUFFER)
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
        const MANA_ORB_START_Y = this.SCREEN_HEIGHT - HEALTH_BAR_BUFFER - MANA_ORB_STROKE_WIDTH - MANA_ORB_RADIUS;

        // create "this.MANA_ORB"
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

        // create "this.RUNE_SLOT"
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

    static get SCREEN_WIDTH() {
        return this.SCREEN_WIDTH;
    }

    static get SCREEN_HEIGHT() {
        return this.SCREEN_HEIGHT;
    }


    ///////////
    // Fonts //
    ///////////

    static get FONT_SIZE() {
        return this.FONT_SIZE;
    }

    static get FONT_SIZE_PX() {
        return this.FONT_SIZE_PX;
    }

    static get START_X() {
        return this.START_X;
    }

    static get START_Y() {
        return this.START_Y;
    }

    static get PIXEL_BUFFER() {
        return this.PIXEL_BUFFER;
    }

    static get FILL_COLOR() {
        return this.FILL_COLOR;
    }

    ////////////
    // Colors //
    ////////////


    static get UI_COLOR(color = "black") {
        return this.UI_COLORS[color];
    }

    static get MANA_COLOR(color = "empty") {
        return this.MANA_COLORS[color];
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
}
