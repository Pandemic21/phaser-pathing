//////////////////////////
// Authoritative Server //
//////////////////////////

// This is the virtual scene that will hold the truth
class ServerGameScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.clients = {}
    }

    preload() {
        //this is where you get access to spellHelper.js.
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
        })

        // this adds a blank tilesetImage. This is server.js, we don't need to draw anything
        let tileset = this.map.addTilesetImage('oryx_world', '')
        this.groundLayer = this.map.createStaticLayer('Ground', tileset);

        // create the (invisible) trees layer, then add collision
        this.treesLayer = this.map.createStaticLayer('Trees', tileset);
        //this.map.setCollisionBetween(1, 999, true, 'Trees');


        //////////////////////
        // Socket.io Config //
        //////////////////////

        // players array. A "player" is a connection to the server's listening socket.io port.
        // the "mage" is the little guy running around the screen.
        // each "player" has a <obj> mage { x, y } where x and y are the mage's current position.
        this.players = []

        // on Socket.io connection
        window.io.on('connection', (socket) => {
            console.log('user connected: ' + socket.id);

            // set the (x,y) spawn location for the new player's mage
            const SPAWN_X = 24*5
            const SPAWN_Y = 24*5

            // add a new mage physics object
            let mage = this.physics.add.sprite(SPAWN_X, SPAWN_Y)

            // set the newPlayer's config parameters
            let newPlayer = {
                id: socket.id,          // this is the player's ID, used to ID the player in update()
                playerName: socket.id,  // TODO: change this to a user configurable setting
                mage: mage              // i know this can be shortened to just "mage" but long form helps me understand better
            }

            // add newPlayer to this.players, which is iterated thru in update()
            this.players.push(newPlayer)

            // this is the initial connection, it's called only when the player first connects
            socket.emit('initialConnectionConfig', this.players)

            // tell all other connected players about the new player
            socket.broadcast.emit('newPlayerJoined', newPlayer)


            socket.on('tryNewMovement', (movementInfo) => {
                console.log("tryNewMovement for: " + movementInfo.requesterId)
                // TODO: this is where we would perform server-side validation
                //  that the "<array> movementInfo.path" the player chose is
                //  actually a valid path, and that they're not cheating

                // do validation here

                // tell each of the other players where the player is moving
                socket.broadcast.emit('setNewMovement', movementInfo)
            })




            /*  Function: "disconnect"
            *    Triggered: on socket disconnect (e.g. player left game)
            *    Result:
            *        - tells clients to remove the player from their screen
            *        - disconnects the server side socket
            */
            socket.on('disconnect', (() => {
                console.log('user disconnected: ' + socket.id);

                // TODO: remove the client from the array
                // TODO: tell connected players to stop rendering the player

                // disconnect the socket
                socket.disconnect(true);
            }));
        });
    }


    update(time, delta) {
        this.gameTime += delta;
        const socket = window.io;

        // // emit isaac movement
        // var x = player.x;
        // var y = player.y;
        //
        // // send the new position to all clients
        // socket.emit('setIsaacMovement', {
        //     isaacRot: r,
        //     isaacX: x,
        //     isaacY: y,
        //     playerId: player.name,
        //     hp,
        //     burning
        // });
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
}

var game = new Phaser.Game(config);

game.scene.add('ServerGameScene', ServerGameScene)
game.scene.start('ServerGameScene')

window.gameLoaded();
