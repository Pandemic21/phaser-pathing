import Location from './lib/Location.js';
import Projectile from './lib/Projectile.js';

export default class ClientGameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init(data) {
        this.eventEmitter = data.eventEmitter;
    }

    preload() {
        ////////////
        // Images //
        ////////////

        this.load.image('isaacImg', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_04.png');
        this.load.image('isaacBreathe', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_22.png');
        this.load.image('fireball', './assets/sliced/fx_32x32/oryx_16bit_fantasy_fx_41.png');

        this.load.image('orb', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_42.png');
        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');

        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');


        ///////////
        // Audio //
        ///////////

        this.load.audio('movementClickSound', './assets/sounds/Bluezone_BC0268_switch_button_click_small_005.wav');
        this.load.audio('movementClickBlip', './assets/sounds/Blip.mp3');


        /////////
        // Map //
        /////////

        this.load.image('base_tiles', '../assets/maps/oryx_world.png');

        //this.load.tilemapTiledJSON('tilemap', '../assets/maps/forest_map_small_v2.json')
        //this.load.tilemapTiledJSON('tilemap', '../assets/maps/forest_map_100x100_v1.json')
        //this.load.tilemapTiledJSON('tilemap', '../assets/maps/forest_map_100x100_v2.json');
        this.load.tilemapTiledJSON('tilemap', '../assets/maps/ForestSwirl_50x50_v1.json');
    }

    create() {
        ////////////////////
        // Scene Launches //
        ////////////////////

        this.scene.launch('uiScene', {
            eventEmitter: this.eventEmitter
        });

        this.scene.launch('spellCastingScene', {
            eventEmitter: this.eventEmitter
        });


        ///////////////
        // Constants //
        ///////////////

        const PLAYER_SPEED = 75; // lower is faster
        const TICK_RATE = 50; // how fast we receive gameState snapshots. this needs to be the same on the server and the client.


        ///////////////
        // Variables //
        ///////////////

        let easystarArray = [];

        //////////////////
        // Map Creation //
        //////////////////

        // create the Tilemap
        let map = this.make.tilemap({
            key: 'tilemap',
            tileWidth: 24,
            tileHeight: 24
        });

        // add the tileset image we are using
        const tileset = map.addTilesetImage('oryx_world', 'base_tiles');

        // 'Ground' layer will be first
        let ground = map.createLayer('Ground', tileset);

        // 'Trees' layer will be second
        let treesLayer = map.createStaticLayer('Trees', tileset);


        // map height and width in raw pixels (used for minimap)
        this.MAP_WIDTH_PIXELS = map.width * map.tileWidth;
        this.MAP_HEIGHT_PIXELS = map.height * map.tileHeight;


        ////////////
        // Camera //
        ////////////

        // disabling because i'm implementing spellcasting 9/8/21
        // setup camera config
        // const cursors = this.input.keyboard.createCursorKeys();
        //
        // const controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        //     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        //     acceleration: 0.06,
        //     drag: 0.0005,
        //     maxSpeed: 1.0
        // };
        //
        // // declare the camera
        // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        /**
         * How far (in pixels) the user can scroll/pan with their camera outside of the map.
         *
         * This allows the player to pan the camera so the UI isn't blocking what they want to see.
         * @type {Number}
         */
        const OVERSCROLL = 150; //IDEA: make this configurable in the web front end
        this.camera = this.cameras.main;
        this.camera.setBounds(OVERSCROLL * -1, OVERSCROLL * -1, this.MAP_WIDTH_PIXELS + OVERSCROLL * 2, this.MAP_HEIGHT_PIXELS + OVERSCROLL * 2);


        /////////////
        // Minimap //
        /////////////

        // constants and variables
        this.SCREEN_WIDTH = 800;
        this.SCREEN_HEIGHT = 600;

        this.MINIMAP_WIDTH = this.SCREEN_WIDTH / 4;
        this.MINIMAP_HEIGHT = this.SCREEN_HEIGHT / 4;
        this.MINIMAP_ZOOM = 0.2;
        this.MINIMAP_X = this.SCREEN_WIDTH - this.MINIMAP_WIDTH; // right side of the screen
        this.MINIMAP_Y = this.SCREEN_HEIGHT - this.MINIMAP_HEIGHT; // bottom of the screen

        // declare this.minimap
        this.minimap = this.cameras.add(this.MINIMAP_X,
            this.MINIMAP_Y,
            this.MINIMAP_WIDTH,
            this.MINIMAP_HEIGHT);
        this.minimap.setZoom(0.2);
        this.minimap.setName('mini');
        this.minimap.setBackgroundColor(0x002244);


        ////////////////
        // Animations //
        ////////////////
        this.anims.create({
            key: 'breathe',
            frames: [{
                key: 'isaacBreathe'
            },
            {
                key: 'isaacImg'
            }],
            frameRate: 4,
            repeat: -1
        });
        //////////////////////
        // Socket.io Config //
        //////////////////////

        this.socket = io();

        this.players = []; // this array contains all the player's in the game
        this.myId = ''; // this is the current player's id
        this.gameStates = []; // this is the array of snapshots we will tween through



        // This is called by server.js when the player first connects
        // it sends '<array> players', which contains all players in the game
        // this function is very, very important
        this.socket.on('initialConnectionConfig', (players) => {
            ////////////
            // Player //
            ////////////

            this.myId = this.socket.id; // set 'this.myId'
            this.players = players; // set '<array> this.players' equal to what the server has

            // this plucks the current player out of '<array> players' the server sent
            let myPlayer = players.find((player) => {
                return player.id == this.myId;
            });

            // create sprite graphics for all player's mages
            for (let k = 0; k < players.length; k++) {
                console.log(players[k].id);
                players[k].mage = this.physics.add.sprite(players[k].mage.x, players[k].mage.y, 'isaacImg');
                players[k].mage.play('breathe');
            }

            // HACK: this fixes the super-speed glitch at the beginning by just moving the player once at the very start.
            let destination = {
                x: Math.floor((myPlayer.mage.x + 0.5) / 12),
                y: Math.floor((myPlayer.mage.y + 0.5) / 12)
            };
            let movementInfo = {
                requesterId: this.socket.id,
                destination
            };
            setTimeout(() => {
                this.socket.emit('tryNewMovement', movementInfo);
            }, 250);
            // end hack

            //////////
            // Mana //
            //////////

            // maximum mana
            this.MAX_MANA = 3;
            this.currentMana = [
                3, /* Fire     */
                3, /* Water    */
                3, /* Earth    */
                3, /* Air      */
                3, /* Light    */
                3 /*  Dark    */
            ];

            // map each element to a name (for readability only)
            // for example:
            //  this.currentMana[this.manaData.fire] = this.currentMana[this.manaData.fire] - 3
            //  this.manaRequirements[this.manaData.FIRE]
            this.manaData = new Map();
            this.manaData.FIRE = 0;
            this.manaData.WATER = 1;
            this.manaData.EARTH = 2;
            this.manaData.AIR = 3;
            this.manaData.LIGHT = 4;
            this.manaData.DARK = 4;

            // is a spell primed and ready to cast?
            this.spellPrimed = false;

            // what is the input priority?
            this.inputPriority = 'movement';

            this.spellPositions = {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0
            };

            /**
             * This is called by `SpellCastingScene.js`, which is called after the player hits 'spacebar
             * @function
             * @param {String} spell
             * @param {Number[]} manaRequirements
             */
            this.eventEmitter.on('primeSpell', (spell, manaRequirements) => {
                // redraw the mana circles
                this.eventEmitter.emit('redrawManaCircles', this.currentMana);

                // if we do NOT have the required mana to cast the spell, stop trying.
                if(!this.hasEnoughMana(this.currentMana, manaRequirements)) return false;

                // find out what spell we got from SpellCastingScene.js and take the appropriate action
                if (spell == 'fireball') {
                    //this.localCastProjectile(manaRequirements);

                    const target = {
                        x: this.input.mousePointer.worldX,
                        y: this.input.mousePointer.worldY
                    };

                    // tell server.js to start casting the fireball
                    this.socket.emit('tryFireball', target);

                    // update our mana
                    //this.currentMana = this.eventEmitter.emit('getNewCurrentMana', ({currentMana: this.currentMana, manaRequirements}));
                    this.currentMana = this.getNewCurrentMana(this.currentMana, manaRequirements);
                    this.eventEmitter.emit('clearRuneSlots');
                    this.eventEmitter.emit('redrawManaCircles', this.currentMana);

                } else if (spell == 'air projectile') {
                    // this.localCastProjectile(manaRequirements);
                } else if (spell == 'explosion') {
                    // this.localCastExplosion(manaRequirements);

                    // run the casting animation
                    this.eventEmitter.emit('startCastingBar', 1000);

                } else if (spell == 'air explosion') {
                    // run the casting animation

                    const CAST_TIME = 2500;
                    this.eventEmitter.emit('startCastingBar', 2500);
                } else if (spell == 'burn') {
                    // this.localCastBurn();
                } else if (spell == 'wall') {
                    // this.localCastWall(manaRequirements);
                }
            });
        });

        // this is called by server.js whenever a new player joins
        this.socket.on('newPlayerJoined', (newPlayer) => {
            console.log('New player joined: ' + newPlayer.id);

            // add the new player to '<array> this.players'
            this.players.push(newPlayer);

            // draw the new player's mage
            newPlayer.mage = this.physics.add.sprite(newPlayer.mage.x, newPlayer.mage.y, 'isaacImg');
        });

        /**
         * setUpdate is called by `server.js`.
         *
         * Once `ClientGameScene.js` has two GameStates it adds tweens to all objects in the GameState between the two states.
         *
         * For example, if in stateA the mage is at (0,0) and in stateB the mage is at (0,10), this function draws a visual
         * animation tween for the mage between the two game states. This simulates the mage "moving" from his position in
         * the old GameState to his position in the new GameState.
         * @function
         * @param {GameState} gameState
         */
        this.socket.on('setUpdate', (gameState) => {
            //add the new snapshot to our gameStates array
            this.gameStates.push(gameState);

            //nothing to tween if theres not at least two snapshots
            if (this.gameStates.length < 2) return;

            const stateA = this.gameStates[this.gameStates.length - 2];
            const stateB = this.gameStates[this.gameStates.length - 1];

            stateA.players.forEach((player) => {
                const currentPlayer = this.players.find((p) => {
                    return p.id === player.id;
                });
                if (currentPlayer) {
                    currentPlayer.mage.fromX = player.x;
                    currentPlayer.mage.fromY = player.y;
                }

            });

            stateB.players.forEach((player) => {
                const currentPlayer = this.players.find((p) => {
                    return p.id === player.id;
                });
                if (currentPlayer) {
                    currentPlayer.mage.toX = player.x;
                    currentPlayer.mage.toY = player.y;
                }
            });
            //check for and handle disconnects here
            this.players.forEach((player) => {
                const findPlayer = stateB.players.find((p) => {
                    return p.id === player.id;
                });
                if (!findPlayer) {
                    player.mage.destroy();
                }
            });
            //handle projectiles
            stateA.projectiles.forEach((proj) => {
                //instantiate the projectile array if it hasn't been
                if (!this.projectiles) this.projectiles = [];
                const projectile = this.projectiles.find((p) => {
                    return p.projectileId === proj.projectileId;
                });
                //if there's no projectile, create it;
                if (!projectile) {
                    const config = {
                        owner: proj.owner,
                        x: proj.x,
                        y: proj.y,
                        target: proj.target,
                        projectileId: proj.projectileId
                    };
                    const newProj = new Projectile(this, config);
                    console.log(newProj.x, newProj.y);
                    this.projectiles.push(newProj);
                } else {
                    projectile.fromX = proj.x;
                    projectile.fromY = proj.y;
                }
            });
            stateB.projectiles.forEach((proj) => {
                //we only want to instantiate anything here if its in both stateA and stateB for interpolating
                if (!this.projectiles) return;
                const projectile = this.projectiles.find((p) => {
                    return p.projectileId === proj.projectileId;
                });
                //same as above
                if (!projectile) {
                    return;
                } else {
                    projectile.toX = proj.x;
                    projectile.toY = proj.y;
                }

            });

            this.calculateTweens(TICK_RATE);


        });

        ////////////////////////////////////////////
        // Listener Config (e.g. spacebar, click) //
        ////////////////////////////////////////////

        // 'T' re-centers the camera on 'myPlayer.mage'
        this.input.keyboard.on('keyup-T', (keyPress) => {
            // get this player
            // let myPlayer = this.players.find((player) => {
            //     return player.id == this.myId;
            // })
            let myPlayer = this.players.find(player => player.id == this.myId);

            // if 'myPlayer' exists, center the camera on 'myPlayer.mage'
            if (myPlayer) {
                this.camera.scrollX = myPlayer.mage.x - this.SCREEN_WIDTH / 2;
                this.camera.scrollY = myPlayer.mage.y - this.SCREEN_HEIGHT / 2;
            }
        });

        // disabling 8/9/21 since i'm implementing proper spellcasting


        // this.input.keyboard.on('keyup-SPACE', (keypress) => {
        //
        //     const target = {
        //         x: this.input.mousePointer.worldX,
        //         y: this.input.mousePointer.worldY
        //     };
        //     this.socket.emit('tryFireball', target);
        // });
        //
        //
        // // toggle follscreen on keypress: F
        // this.input.keyboard.on('keyup-F', (keyPress) => {
        //     // if it's fullscreen already, toggle fullscreen off
        //     if (this.scale.isFullscreen) {
        //         this.scale.stopFullscreen();
        //     }
        //     // if it's not fullscreen, toggle fullscreen on
        //     else {
        //         this.scale.startFullscreen();
        //     }
        // });

        // pan the camera around with the mouse
        this.input.on('pointermove', (pointer) => {
            // the is not holding RMB, stop panning the camera
            if (!pointer.rightButtonDown()) return;

            // adjust the camera
            const SCROLL_SPEED = 2;

            // SCROLL_SPEED adjusts how fast the camera moves
            this.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.camera.zoom * SCROLL_SPEED;
            this.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.camera.zoom * SCROLL_SPEED;
        });

        // Mouse (left and right mouse click)
        this.input.on('pointerdown', (pointer) => {
            // if RMB (right click)
            if (pointer.rightButtonDown()) {
                // do stuff
            }

            // else it's LMB, move the player to the destination
            else {
                // draw the 'click to move' image and debug console logs
                this.drawMovementDestinationImage({
                    x: this.input.mousePointer.x + this.camera.scrollX,
                    y: this.input.mousePointer.y + this.camera.scrollY
                });

                // destination location (x,y) the player clicked

                /**
                 * This object contains all information required for the client use/draw fonts
                 * @type {Object}
                 * @prop {Number} x
                 * @prop {Number} y
                 */
                let destination = {
                    x: this.input.mousePointer.x,
                    y: this.input.mousePointer.y
                };

                // each tile on the map is 24x24 pixels
                // the pathable map has double the amount of tiles but is the same width/height, so the pixel size for each tile is half (12x12)
                // this translates where the user clicked (raw pixel location on the screen) to where they clicked on the 12x12 tile map/array
                destination.x = Math.floor((this.camera.scrollX + destination.x + 0.5) / 12);
                destination.y = Math.floor((this.camera.scrollY + destination.y + 0.5) / 12);

                // if a tree is clicked, search for a clickable tile.
                if (easystarArray[destination.y][destination.x] === 1) {
                    let newDest = this.findNearbyWalkablePoint(destination.x, destination.y, easystarArray);
                    // if we found a tree, replace the bad click
                    if (newDest !== undefined) {
                        destination.x = newDest.x;
                        destination.y = newDest.y;
                    }
                }
                let movementInfo = {
                    requesterId: this.socket.id,
                    destination
                };
                this.socket.emit('tryNewMovement', movementInfo);

                // draw the 'click to move' image and debug console logs
                this.drawMovementDestinationImage({
                    x: this.input.mousePointer.x + this.camera.scrollX,
                    y: this.input.mousePointer.y + this.camera.scrollY
                });
            }
        }, this);

        // Mana and element input
        // spacebar - primes the current spell
        this.input.keyboard.on('keydown-SPACE', (keyPress) => {
            // tell UIScene.js to redraw the mana circles
            this.eventEmitter.emit('redrawManaCircles', this.currentMana);

            // get the spell they've queued with their runes
            this.spellPrimed = this.eventEmitter.emit('calculateSpell');
        });

        // q - fire
        this.input.keyboard.on('keyup-Q', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });

        // w - water
        this.input.keyboard.on('keyup-W', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });

        // e - earth
        this.input.keyboard.on('keyup-E', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });

        // r - air
        this.input.keyboard.on('keyup-R', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });

        // d - light
        this.input.keyboard.on('keyup-D', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });

        // f - dark
        this.input.keyboard.on('keyup-F', (keyPress) => {
            this.eventEmitter.emit('drawRuneSlots', keyPress);
        });


        ////////////////////
        // BEGIN EASYSTAR //
        ////////////////////

        for (let i = 0; i < map.height * 2; i++) { // height*2 to double the times to path on
            let arr = [];
            let oneMore = false; // used to fix visual issue of walking on trees on the right side
            for (let j = 0; j < map.width * 2; j++) { // width*2 to double the times to path on

                // there are twice as many pathable tiles are visual tiles.
                // this algorithm translates the current pathable tile to the larger, collidable tile
                let parentX = Math.floor((j + 0.5) / 2);
                let parentY = Math.floor((i + 0.5) / 2);

                if (treesLayer.getTileAt(parentX, parentY) !== null) {
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
    }


    ////////////
    // Update //
    ////////////

    update(time, delta) {

        // commenting this out because i'm implementing spellcasting
        // camera arrow keys update
        // this.controls.update(delta);

        // get this player
        let myPlayer = this.players.find((player) => {
            return player.id == this.myId;
        });

        // if we found the player, continue update()
        if (myPlayer) {
            // minimap scrolling update
            this.minimap.scrollX = myPlayer.mage.x;
            this.minimap.scrollY = myPlayer.mage.y;

            // this makes the minimap ccamera follow with Phaser.Math.Clamp, which would be interesting: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/clamp/
            // this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - this.MINIMAP_WIDTH / 2, 0, 800);
            // this.minimap.scrollY = Phaser.Math.Clamp(this.player.y - this.MINIMAP_HEIGHT / 2, 0, 10000);
        }
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    // Calculate tweens here.
    calculateTweens(TICK_RATE) {
        this.players.forEach((player) => {
            if (player.mage.fromX && player.mage.fromY && player.mage.toX && player.mage.toY) {
                if (player.mage.fromX < player.mage.toX) player.mage.setFlipX(true);
                if (player.mage.fromX > player.mage.toX) player.mage.setFlipX(false);
                var ex = player.mage.toX;
                var ey = player.mage.toY;

                this.tweens.add({
                    targets: player.mage,
                    x: {
                        value: ex,
                        duration: TICK_RATE
                    },
                    y: {
                        value: ey,
                        duration: TICK_RATE
                    }
                });
            }

        });
        if (this.projectiles) {
            this.projectiles.forEach((projectile) => {
                if (projectile.fromX && projectile.fromY && projectile.toX && projectile.toY) {
                    var ex = projectile.toX;
                    var ey = projectile.toY;

                    this.tweens.add({
                        targets: projectile,
                        x: {
                            value: ex,
                            duration: TICK_RATE
                        },
                        y: {
                            value: ey,
                            duration: TICK_RATE
                        }
                    });
                }

            });
        }



    }



    /**
     * findNearbyWalkablePoint
     *
     * Could potentially do this recursively to always find a point, but it already feels solid this way.
     *
     * @param {int}	x - x location to search near
     * @param {int}	y - y location to search near
     * @param {easystar[]}	easystarArray - this is the parameter easystarArray
     *
     * @return {Phaser.Math.Vector2}
     *
     */
    findNearbyWalkablePoint(x, y, easystarArray) {
        let destVec = new Phaser.Math.Vector2(x, y);
        let destLook = destVec.clone();
        let destLookArr = [];

        if (easystarArray[destVec.y][destVec.x] === 0) {
            return destVec;
        } else {
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.DOWN));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.LEFT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP)
                .add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP)
                .add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP)
                .add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP)
                .add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
        }
    }


    /**
     * drawMovementDestinationImage
     *
     * @param {object}	destination - this is the destination location
     * @param {int} destination.x - the X coordination for the destination
     * @param {int} destination.y - the X coordination for the destination
     *
     */
    drawMovementDestinationImage(destination) {
        // image duration in ms
        const DURATION = 0.5 * 1000;
        let clickImg = this.add.image(destination.x, destination.y, 'movementClick');
        clickImg.setScale(2.5, 2.5);

        //this.sound.play('movementClickSound', {volume: 0.25});
        this.sound.play('movementClickBlip', {
            volume: 0.01
        });

        // this deletes the image after <ms> DURATION
        setTimeout(() => {
            clickImg.destroy();
        }, DURATION);
    }


    ////////////////////
    // Mana functions //
    ////////////////////

    hasEnoughMana(currentMana, manaRequirements) {
        // go through each of the mana types (fire, water, etc...)
        for(let k=0; k<manaRequirements.length; k++) {
            // get what would be the new current mana for that element, after casting the spell
            let newManaValue = currentMana[k] - manaRequirements[k];

            // if the new mana is <0, checkManaRequirements failed.
            if(newManaValue < 0) return false;
        }
        // if we got here then we're good.
        return true;
    }

    getNewCurrentMana(currentMana, manaRequirements) {
        let newCurrentMana = currentMana;

        for(let k=0; k<manaRequirements.length; k++) {
            newCurrentMana[k] = currentMana[k] - manaRequirements[k];
        }

        return newCurrentMana;
    }
}
