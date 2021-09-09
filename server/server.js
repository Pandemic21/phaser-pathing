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

        //this.load.tilemapTiledJSON('tilemap', 'file:///' + __dirname + '/public/assets/maps/forest_map_small.json');
        //this.load.tilemapTiledJSON('tilemap', 'file:///' + __dirname + '/public/assets/maps/forest_map_small_v2.json');
        //this.load.tilemapTiledJSON('tilemap', 'file:///' + __dirname + '/public/assets/maps/forest_map_100x100_v2.json');
        this.load.tilemapTiledJSON('tilemap', 'file:///' + __dirname + '/public/assets/maps/ForestSwirl_50x50_v1.json');
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


        ////////////////////
        // BEGIN EASYSTAR //
        ////////////////////
        this.easystar = new window.easystar.js();

        let easystarArray = [];

        for (let i = 0; i < this.map.height * 2; i++) { // height*2 to double the times to path on
            let arr = [];
            let oneMore = false; // used to fix visual issue of walking on trees on the right side
            for (let j = 0; j < this.map.width * 2; j++) { // width*2 to double the times to path on

                // there are twice as many pathable tiles are visual tiles.
                // this algorithm translates the current pathable tile to the larger, collidable tile
                let parentX = Math.floor((j + 0.5) / 2);
                let parentY = Math.floor((i + 0.5) / 2);

                if (this.treesLayer.getTileAt(parentX, parentY) !== null) {
                    arr.push(1); // if there is a tree, arr[j] = 1
                    oneMore = true;
                } else if (oneMore) {
                    arr.push(1);
                    oneMore = false; // additionally, if there is a tree 1 half-tile to the left, arr[j] = 1
                } else {
                    arr.push(0); // if there is NOT a tree, arr[j] = 0
                }

            }
            easystarArray.push(arr);
        }

        console.log('easystarArray width: ' + easystarArray[0].length);
        console.log('easystarArray height: ' + easystarArray.length);

        this.easystar.setGrid(easystarArray);
        this.easystar.setAcceptableTiles(0);
        this.easystar.enableDiagonals();
        this.easystar.disableCornerCutting(); // this stops us from pathing into trees


        //////////////////////
        // Socket.io Config //
        //////////////////////

        // players array. A 'player' is a connection to the server's listening socket.io port.
        // the 'mage' is the little guy running around the screen.
        // each 'player' has '<obj> mage', which is a Phaser physics object
        this.players = [];
        this.projectiles = this.physics.add.group();

        // on Socket.io connection
        window.io.on('connection', (socket) => {
            console.log('user connected: ' + socket.id);

            // set the (x,y) spawn location for the new player's mage
            const SPAWN_X = 24 * 5;
            const SPAWN_Y = 24 * 5;

            // add a new mage physics object
            let mage = this.physics.add.sprite(SPAWN_X, SPAWN_Y);

            // set the newPlayer's config parameters
            let newPlayer = {
                id: socket.id, // this is the player's ID, used to ID the player in update()
                playerName: socket.id, // TODO: change this to a user configurable setting
                mage: mage, // i know this can be shortened to just 'mage' but long form helps me understand better
                moveTick: 0, // these will be used to know when to move the character
                lastMoveTick: 0 //
            };

            // add newPlayer to this.players, which is iterated thru in update()
            this.players.push(newPlayer);

            // this is the initial connection, it's called only when the player first connects
            socket.emit('initialConnectionConfig', this.players);

            // tell all other connected players about the new player
            socket.broadcast.emit('newPlayerJoined', newPlayer);

            socket.on('tryFireball', target => {
                //this will become a cast fireball function, there should just be a tryCast or something for spells
                const owner = this.players.find((player) => {
                    return player.id === socket.id;
                });
                const speed = 600;
                if (!this.projectileId) this.projectileId = 0;
                const projectileId = this.projectileId;
                this.projectileId += 1;
                const projectile = {
                    owner,
                    target,
                    speed,
                    projectileId
                };
                this.createProjectile(projectile);
            });


            /* this is called by ClientGameScene.js when the player orders their mage to move
            movementInfo = {
                requesterId: this.myId, // <str> ID of the player who made the movement order
                path,                   // <array> easystar path the mage will take
            }
            */
            socket.on('tryNewMovement', (movementInfo) => {
                console.log('tryNewMovement for: ' + movementInfo.requesterId);
                // TODO: this is where we would perform server-side validation
                //  that the '<array> movementInfo.path' the player chose is
                //  actually a valid path, and that they're not cheating
                console.log('Movement: ', movementInfo);
                let destination = movementInfo.destination;
                // find the current player
                const player = this.players.find((player) => {
                    return player.id === socket.id;
                });
                let tmpPlayerPosition = {
                    x: Math.floor((player.mage.x + 0.5) / 12), //convert World x to minitile x,
                    y: Math.floor((player.mage.y + 0.5) / 12) //convert World y to minitile y
                };

                this.easystar.findPath(tmpPlayerPosition.x, tmpPlayerPosition.y, destination.x, destination.y, (path) => {
                    if (path === null) {
                        console.warn('Path was not found.');
                    } else {
                        player.mage.path = path;
                    }
                });
                this.easystar.calculate();
            });

            // this is called when a player disconencts
            socket.on('disconnect', (() => {
                console.log('user disconnected: ' + socket.id);
                let playerIndex = this.players.findIndex((player) => {
                    return player.id === socket.id;
                });
                this.players.splice(playerIndex, 1);
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
        this.gameState.projectiles = [];

        const PLAYER_SPEED = 75; //this is how many ms should be between each tile movement, lower = faster
        //this is where we calculate movement
        this.players.forEach((player) => {
            player.moveTick += delta;
            //if the player has a path and should move, move them
            if (player.mage.path && player.moveTick - player.lastMoveTick > PLAYER_SPEED) {
                //default to current location
                let location = {
                    x: player.mage.x / 12,
                    y: player.mage.y / 12,
                };
                //if there's an active path, move to the next node and remove it
                if (player.mage.path.length > 0) {
                    //this finds the current location in the path if it exists, to make sure we are starting from our current location
                    let currentLocIndex = player.mage.path.findIndex((loc) => {
                        return location.x === loc.x && location.y === loc.y;
                    });
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
            this.gameState.players.push({
                id: player.id,
                x: player.mage.x,
                y: player.mage.y
            });
        }, this);

        this.projectiles.getChildren().forEach((projectile) => {
            this.gameState.projectiles.push({
                owner: projectile.owner,
                projectileId: projectile.projectileId,
                angle: projectile.angle,
                x: projectile.x,
                y: projectile.y,
                target: projectile.target
            });
        });

        const TICK_RATE = 50; // this is how often we send setUpdate.
        socket.emit('setUpdate', this.gameState);
    }


    //////////////////////
    // Custom Functions //
    //////////////////////


    createProjectile(projectile) {
        // projectile = {
        //   owner,
        //   target,
        //   speed,
        //   projectileId
        // }
        config = {
          x: projectile.owner.mage.x,
          y: projectile.owner.mage.y,
          projectileId: projectile.projectileId,
          target: projectile.target,
          owner: projectile.owner
        }

        const newProj = new window.Projectile(this, config);
        this.projectiles.add(newProj);
        this.physics.moveTo(newProj, projectile.target.x, projectile.target.y, projectile.speed);

    }
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
