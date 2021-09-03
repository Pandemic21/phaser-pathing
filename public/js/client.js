/////////////
// Imports //
/////////////

import ClientGameScene from './ClientGameScene.js';
let clientGameScene = new ClientGameScene();

/////////////////
// Phaser Init //
/////////////////

console.log("Starting...")

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

// prevents default right click website behavior
game.canvas.oncontextmenu = function(e) {
    e.preventDefault();
}

game.scene.add('clientGameScene', clientGameScene)
game.scene.start('clientGameScene')

console.log("Complete.")
