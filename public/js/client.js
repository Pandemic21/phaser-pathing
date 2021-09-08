/////////////
// Imports //
/////////////

import ClientGameScene from './ClientGameScene.js';
let clientGameScene = new ClientGameScene();

import UIScene from './UIScene.js';
let uiScene = new UIScene();

let easystar = new EasyStar.js();

/////////////////
// Phaser Init //
/////////////////

console.log(`Starting...`);

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 0
            },
            fps: 60
        }
    }
};
let game = new Phaser.Game(config);
let eventEmitter = new Phaser.Events.EventEmitter();

// prevents default right click website behavior
game.canvas.oncontextmenu = function(e) {
    e.preventDefault();
};

game.scene.add('clientGameScene', clientGameScene);
game.scene.add('uiScene', uiScene);

game.scene.start('clientGameScene', {
    eventEmitter
});

console.log(`Complete.`);
