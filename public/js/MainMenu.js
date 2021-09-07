import UIHelper from './UIHelper.js';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super();
    }

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

    create() {
        /* Contains:
        *    Constants
        *    Buttons
        *    Camera
        *    Buttons
        */

        console.log("Creating scene");

        ///////////////
        // Constants //
        ///////////////

        this.SCENE_KEY_MAIN_MENU = 'mainMenuScene';
        this.SCENE_KEY_CLIENT_GAME = 'clientGameScene';
        this.SCENE_KEY_UI = 'uiScene';
        this.SCENE_KEY_CREDITS = 'creditsScene';
        this.SCENE_KEY_SETTINGS = 'settingsScene';

        this.SCENE_KEY_CURRENT = this.SCENE_KEY_MAIN_MENU;


        ///////////////////////
        // Main Menu Buttons //
        ///////////////////////

        let buttons = this.rexUI.add.buttons({
            x: UIHelper.BUTTON_START_X,
            y: UIHelper.BUTTON_START_Y,
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
            if (button.text == "Play Game") {
                console.log('Play button pressed');
                this.scene.start(this.SCENE_KEY_CLIENT_GAME, {
                    eventEmitter: this.eventEmitter
                });
            }

            // Clicked: Credits
            if (button.text == "Credits") {
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

        let backButton = this.rexUI.add.buttons({
            x: UIHelper.BUTTON_BACK_START_X,
            y: UIHelper.BUTTON_BACK_START_Y,
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
            if (button.text == "Back") {
                console.log('Back button pressed');
            }
        });

        buttons.on('button.out', () => {
            return; // this is called when the mouse LEAVES the button (can be used for highlighting)
        });

        buttons.on('button.over', () => {
            return; // this is called when the mouse ENTERS the button (can be used for highlighting)
        });


        ////////////
        // Camera //
        ////////////

        // set background
        //this.cameras.main.backgroundColor.setTo(145, 145, 145);
        UIHelper.setCameraBackgroundColor(this.cameras.main);


        console.log("Created.");
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    createButton(scene, text) {
        return scene.rexUI.add.label({
            width: UIHelper.BUTTON_WIDTH,
            height: UIHelper.BUTTON_HEIGHT,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, UIHelper.COLOR_LIGHT),
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
