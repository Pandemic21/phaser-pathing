import UIHelper from './UIHelper.js';

// TODO: refactor all of this code to match the refactors UIHelper.js. Maybe also refactor UIHelper.js?

/**
 * @class MainMenu
 */
class MainMenu extends Phaser.Scene {
    constructor() {
        super();
    }

    /**
     * Entry point for `Phaser.EventEmitter`
     * @param  {Object} data - The data passed from client.js
     * @prop {Phaser.eventEmitter} data.EventEmitter - The event emitter for the client instance
     * @return {Void} - Sets up the MainMenu.js eventEmitter
     */
    init(data) {
        this.eventEmitter = data.eventEmitter;
    }


    preload() {
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

    /**
     * Autorun one time when the Phaser Scene is created
     * Creates the following:
     *  * Constants
     *  * Buttons
     *  * Camera
     *  > Calls functions:
     *  > * {@link MainMenu#createButton}
     *  > * {@link UIHelper.createBackButton}
     *  > * {@link UIHelper.createButton}
     *  > * {@link UIHelper.createRadioButton}
     * @return {Void}
     */
    create() {
        /* Contains:
        *    Constants
        *    Buttons
        *    Camera
        *    Buttons
        */

        console.log(`Creating scene`);

        ///////////////
        // Constants //
        ///////////////

        /** @const {String} */
        this.SCENE_KEY_MAIN_MENU = 'mainMenuScene';
        /** @const {String} */
        this.SCENE_KEY_CLIENT_GAME = 'clientGameScene';
        /** @const {String} */
        this.SCENE_KEY_UI = 'uiScene';
        /** @const {String} */
        this.SCENE_KEY_CREDITS = 'creditsScene';
        /** @const {String} */
        this.SCENE_KEY_SETTINGS = 'settingsScene';
        /** @const {String} */
        this.SCENE_KEY_CURRENT = this.SCENE_KEY_MAIN_MENU;


        ///////////////////////
        // Main Menu Buttons //
        ///////////////////////

        let uiHelperButton = UIHelper.getButton();

        /**
         * The main menu buttons in the center of the screen
         * @type {rexUI.add.buttons}
         */
        let buttons = this.rexUI.add.buttons({
            x: uiHelperButton.location.x,
            y: uiHelperButton.location.y,
            orientation: 'y',

            buttons: [
                this.createButton(this, 'Play Game'),
                this.createButton(this, 'Credits'),
            ],

            space: {
                item: 8
            }
        });
        buttons.layout();

        buttons.on('button.click', (button, index, pointer, event) => {
            buttons.setButtonEnable(false);
            console.log(`Click button-${button.text}\n`);

            // disable input
            this.input.stopPropagation();

            // find which button they clicked
            // Clicked: Play Game
            if (button.text == 'Play Game') {
                console.log('Play button pressed');
                this.scene.start(this.SCENE_KEY_CLIENT_GAME, {
                    eventEmitter: this.eventEmitter
                });
            }

            // Clicked: Credits
            if (button.text == 'Credits') {
                console.log('Credits button pressed');
                this.scene.start(this.SCENE_KEY_CREDITS);
            }
        });

        buttons.on('button.out', () => {
            return; // this is called when the mouse LEAVES the button (can be used for highlighting)
        });

        buttons.on('button.over', () => {
            return; // this is called when the mouse ENTERS the button (can be used for highlighting)
        });


        /////////////////
        // Back Button //
        /////////////////

        let uiHelperBackButton = UIHelper.getBackButton();

        /**
         * The back button in the center left of the screen
         * @type {rexUI.add.buttons}
         */
        let backButton = this.rexUI.add.buttons({
            x: uiHelperBackButton.location.x,
            y: uiHelperBackButton.location.y,
            orientation: 'y',

            buttons: [
                this.createButton(this, 'Back'),
            ],

            space: {
                item: 8
            }
        });
        backButton.layout();
        backButton.on('button.click', (button, index, pointer, event) => {
            console.log(`Click button-${button.text}\n`);

            // disable input
            this.input.stopPropagation();

            // find which button they clicked
            // Clicked: Play Game
            if (button.text == 'Back') {
                console.log('Back button pressed');
            }
        });

        backButton.on('button.out', () => {
            return; // this is called when the mouse LEAVES the button (can be used for highlighting)
        });

        backButton.on('button.over', () => {
            return; // this is called when the mouse ENTERS the button (can be used for highlighting)
        });


        ////////////
        // Camera //
        ////////////

        // set background
        //this.cameras.main.backgroundColor.setTo(145, 145, 145);
        UIHelper.setCameraBackgroundColor(this.cameras.main);

        console.log(`Created.`);
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    /**
     * Draws and returns a `rexUI.add.label`
     * > Called by: {@link MainMenu#create}
     * @param  {Phaser.Scene } scene - The Phaser scepne to draw the buttons on
     * @param  {String } text - The text on the button
     * @return {rexUI.add.label} - draws and returns an instance of `rexUI.add.label`
     * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-label/
     */
    createButton(scene, text) {
        let uiHelperButton = UIHelper.getButton();
        let uiHelperUIColors = UIHelper.getUIColors();

        return scene.rexUI.add.label({
            width: uiHelperButton.size.width,
            height: uiHelperButton.size.height,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, uiHelperUIColors.LIGHT),
            text: scene.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        });
    }
}

export default MainMenu;
