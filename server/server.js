//////////////////////////
// Authoritative Server //
//////////////////////////

// This is the virtual scene that will hold the truth
class ServerGameScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.clients = {};
    }

    preload() {
        __dirname = window.__dirname;

        //this.load.tilemapTiledJSON("tilemap", "file:///" + __dirname + "/public/assets/maps/forest_map_small.json");
        //this.load.tilemapTiledJSON("tilemap", "file:///" + __dirname + "/public/assets/maps/forest_map_small_v2.json");
        this.load.tilemapTiledJSON("tilemap", "file:///" + __dirname + "/public/assets/maps/forest_map_100x100_v2.json");
    }

    create() {
        ////////////////////
        // Game Variables //
        ////////////////////

        // this time never stops counting up
        this.gameTime = 0;

        // this timer is for mana regeneration. TODO: rename it
        this.timer = 0;


        //////////////////
        // Map Creation //
        //////////////////

        // create the map from othe tilemap in preload()
        this.map = this.make.tilemap({
            key: 'tilemap',
            tileWidth: 24,
            tileHeight: 24
        });

        // this adds a blank tilesetImage. This is server.js, we don't need to draw anything
        let tileset = this.map.addTilesetImage('oryx_world', '');
        this.groundLayer = this.map.createStaticLayer('Ground', tileset);

        // create the (invisible) trees layer, then add collision
        this.treesLayer = this.map.createStaticLayer('Trees', tileset);
        //this.map.setCollisionBetween(1, 999, true, 'Trees');


        //////////////////////
        // Socket.io Config //
        //////////////////////

        // players array. A "player" is a connection to the server's listening socket.io port.
        // the "mage" is the little guy running around the screen.
        // each "player" has "<obj> mage", which is a Phaser physics object
        this.players = [];

        // on Socket.io connection
        window.io.on('connection', (socket) => {
            console.log('user connected: ' + socket.id);

            // set the (x,y) spawn location for the new player's mage
            const SPAWN_X = 24*5;
            const SPAWN_Y = 24*5;

            // add a new mage physics object
            let mage = this.physics.add.sprite(SPAWN_X, SPAWN_Y);

            // set the newPlayer's config parameters
            let newPlayer = {
                id: socket.id,          // this is the player's ID, used to ID the player in update()
                playerName: socket.id,  // TODO: change this to a user configurable setting
                mage: mage,             // i know this can be shortened to just "mage" but long form helps me understand better
                moveTick: 0,            // these will be used to know when to move the character
                lastMoveTick: 0         //
            };

            // add newPlayer to this.players, which is iterated thru in update()
            this.players.push(newPlayer);

            // this is the initial connection, it's called only when the player first connects
            socket.emit('initialConnectionConfig', this.players);

            // tell all other connected players about the new player
            socket.broadcast.emit('newPlayerJoined', newPlayer);


            /* this is called by ClientGameScene.js when the player orders their mage to move
            movementInfo = {
                requesterId: this.myId, // <str> ID of the player who made the movement order
                path,                   // <array> easystar path the mage will take
            }
            */
            socket.on('tryNewMovement', (movementInfo) => {
                console.log("tryNewMovement for: " + movementInfo.requesterId);
                // TODO: this is where we would perform server-side validation
                //  that the "<array> movementInfo.path" the player chose is
                //  actually a valid path, and that they're not cheating
                console.log('Movement: ', movementInfo);
                // find the current player
                const player = this.players.find((player) => {
                  return player.id === socket.id;
                });
                player.mage.path = movementInfo.path;
            });

            // this is called when a player disconencts
            socket.on('disconnect', (() => {
                console.log('user disconnected: ' + socket.id);

                // TODO: remove the client from the array
                // TODO: tell connected players to stop rendering the player

                // disconnect the socket
                socket.disconnect(true);
            }));
        });
    }


    ////////////
    // Update //
    ////////////

    update(time, delta) {
        this.gameTime += delta;
        const socket = window.io;

        //start building the gameState;
        this.gameState = {};
        this.gameState.gameTime = this.gameTime;
        this.gameState.players = [];

        const PLAYER_SPEED = 100; //this is how many ms should be between each tile movement
        //this is where we calculate movement
        this.players.forEach((player) => {
          player.moveTick += delta;
            //if the player has a path and should move, move them
            if(player.mage.path && player.moveTick - player.lastMoveTick > PLAYER_SPEED) {
              //default to current location
              let location = {
                x: player.mage.x/12,
                y: player.mage.y/12,
              };
              //if there's an active path, move to the next node and remove it
              if(player.mage.path.length > 0){
                //this finds the current location in the path if it exists, to make sure we are starting from our current location
                let currentLocIndex = player.mage.path.findIndex((loc) => {
                  return location.x === loc.x && location.y === loc.y;
                })
                //if the current location is not found currentLocIndex = -1, and therefore we pick up at the beginning of the path
                location = player.mage.path[currentLocIndex + 1];
                //splice the path to the next point
                player.mage.path.splice(0, currentLocIndex + 2);
              }

              //move one tile, and reset lastMoveTick to the appropriate time
              player.mage.x = location.x * 12;
              player.mage.y = location.y * 12;


              //make sure we are updating every tick evenly;
              player.lastMoveTick += PLAYER_SPEED;
          }
        //append the mage's location to gameState
        this.gameState.players.push({id: player.id, x: player.mage.x, y: player.mage.y})
        }, this)

        const TICK_RATE = 50; // this is how often we send setUpdate.
        socket.emit('setUpdate', this.gameState);


    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    // add custom functions here as necessary
}

config = {
    type: Phaser.HEADLESS,
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
    },
    autoFocus: false,
};

var game = new Phaser.Game(config);

game.scene.add('ServerGameScene', ServerGameScene);
game.scene.start('ServerGameScene');

window.gameLoaded();
