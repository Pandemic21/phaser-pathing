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


    static getUIColor(color = "black") {
        return this.UI_COLORS[color]
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // need to clean up below this line
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////
    // Buttons //
    /////////////

    // layout start x, y
    static BUTTON_WIDTH = 120
    static BUTTON_HEIGHT = 40
    static BUTTON_START_X = (this.SCREEN_WIDTH / 2) // this is the X center of the screen, since the origin is (0.5, 0.5)
    static BUTTON_START_Y = (this.SCREEN_HEIGHT / 2) // this is the Y center of the screen, since the origin is (0.5, 0.5)
    static BUTTON_BACK_START_X = (this.SCREEN_WIDTH / 2 - this.BUTTON_WIDTH - this.PIXEL_BUFFER) // sets position to half the screen minute one (1) button width
    static BUTTON_BACK_START_Y = (this.SCREEN_HEIGHT - this.BUTTON_HEIGHT - this.PIXEL_BUFFER) // sets position to bottom of the screen plus PIXEL_BUFFER


    ////////////////
    // Health Bar //
    ////////////////

    // set all bar constants
    static HEALTH_BAR_STROKE_WIDTH = 8;
    static HEALTH_BAR_BUFFER = 10 + this.HEALTH_BAR_STROKE_WIDTH;
    static HEALTH_BAR_WIDTH = 40;
    static HEALTH_BAR_HEIGHT = 100;

    // set health bar constants
    static HEALTH_BAR_START_X = this.HEALTH_BAR_BUFFER
    static HEALTH_BAR_START_Y = this.SCREEN_HEIGHT - this.HEALTH_BAR_BUFFER - this.HEALTH_BAR_HEIGHT // BAR_HEIGHT because we setOrigin(0,0) (e.g. Top Left)


    ////////////////////////////
    // Mana Orbs (all colors) //
    ////////////////////////////

    static MANA_ORB_STROKE_WIDTH = 3
    static MANA_ORB_RADIUS = 10
    static MANA_ORB_BUFFER = 20 + this.MANA_ORB_STROKE_WIDTH + this.MANA_ORB_RADIUS

    // place X to the right of the health bar
    // place Y to the bottom of the screen, with buffer
    static MANA_ORB_START_X = this.HEALTH_BAR_START_X + this.HEALTH_BAR_WIDTH + this.HEALTH_BAR_STROKE_WIDTH + this.HEALTH_BAR_BUFFER
    static MANA_ORB_START_Y = this.SCREEN_HEIGHT - this.HEALTH_BAR_BUFFER - this.MANA_ORB_STROKE_WIDTH - this.MANA_ORB_RADIUS


    ////////////////
    // Rune Slots //
    ////////////////

    static RUNE_SLOT_STROKE_COLOR = 0xefc53f
    static RUNE_SLOT_FILL_COLOR = 0xbcc947
    static RUNE_SLOT_WIDTH = 50
    static RUNE_SLOT_HEIGHT = 50
    static RUNE_SLOT_START_X = (this.SCREEN_WIDTH / 2 - this.RUNE_SLOT_WIDTH * 1.5) // *1.5 because there's 3 rune slots, 1.5 is half.
    static RUNE_SLOT_START_Y = (this.SCREEN_HEIGHT - this.PIXEL_BUFFER)


    constructor() {}


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
