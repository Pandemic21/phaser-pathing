export default class ClientGameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init() {

    }

    preload() {
        ////////////
        // Images //
        ////////////

        this.load.image('isaacImg', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_04.png');
        this.load.image('isaacBreathe', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_22.png');

        this.load.image('orb', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_42.png');
        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');

        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');


        ///////////
        // Audio //
        ///////////

        this.load.audio('movementClickSound', "./assets/sounds/Bluezone_BC0268_switch_button_click_small_005.wav");
        this.load.audio('movementClickBlip', "./assets/sounds/Blip.mp3");


        /////////
        // Map //
        /////////

        this.load.image("base_tiles", "../assets/maps/oryx_world.png");

        //this.load.tilemapTiledJSON("tilemap", "../assets/maps/forest_map_small_v2.json")
        //this.load.tilemapTiledJSON("tilemap", "../assets/maps/forest_map_100x100_v1.json")
        this.load.tilemapTiledJSON("tilemap", "../assets/maps/forest_map_100x100_v2.json");
    }

    create() {
        ///////////////
        // Constants //
        ///////////////

        const PLAYER_SPEED = 50; // lower is faster
        const TICK_RATE = 50; // how fast we receive gameState snapshots. this needs to be the same on the server and the client.

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

        // "Ground" layer will be first
        let ground = map.createLayer('Ground', tileset);

        // "Trees" layer will be second
        let treesLayer = map.createStaticLayer('Trees', tileset);


        // map height and width in raw pixels (used for minimap)
        this.MAP_WIDTH_PIXELS = map.width * map.tileWidth;
        this.MAP_HEIGHT_PIXELS = map.height * map.tileHeight;


        ////////////
        // Camera //
        ////////////

        // setup camera config
        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        // declare the camera
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.MAP_WIDTH_PIXELS, this.MAP_HEIGHT_PIXELS);


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
        this.minimap = this.cameras.add(
            this.MINIMAP_X,
            this.MINIMAP_Y,
            this.MINIMAP_WIDTH,
            this.MINIMAP_HEIGHT)
            .setZoom(0.2)
            .setName('mini')
            .setBackgroundColor(0x002244);
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
                }
            ],
            frameRate: 4,
            repeat: -1
        })
        //////////////////////
        // Socket.io Config //
        //////////////////////

        this.socket = io();

        this.players = [];   // this array contains all the player's in the game
        this.myId = '';      // this is the current player's id
        this.gameStates = [] // this is the array of snapshots we will tween through



        // This is called by server.js when the player first connects
        // it sends "<array> players", which contains all players in the game
        this.socket.on('initialConnectionConfig', (players) => {
            ////////////
            // Player //
            ////////////

            this.myId = this.socket.id;  // set "this.myId"
            this.players = players; // set "<array> this.players" equal to what the server has

            // this plucks the current player out of "<array> players" the server sent
            let myPlayer = players.find((player) => {
                return player.id == this.myId;
            });

            // create sprite graphics for all player's mages
            for (let k = 0; k < players.length; k++) {
              console.log(players[k].id);
              players[k].mage = this.physics.add.sprite(players[k].mage.x, players[k].mage.y, 'isaacImg');
              players[k].mage.play('breathe');
            }
        });

        // this is called by server.js whenever a new player joins
        this.socket.on('newPlayerJoined', (newPlayer) => {
            console.log("New player joined: " + newPlayer.id);

            // add the new player to "<array> this.players"
            this.players.push(newPlayer);

            // draw the new player's mage
            newPlayer.mage = this.physics.add.sprite(newPlayer.mage.x, newPlayer.mage.y, 'isaacImg');
        });

        this.socket.on('setUpdate', (gameState) => {
          //add the new snapshot to our gameStates array
          this.gameStates.push(gameState);

          //nothing to tween if theres not at least two snapshots
          if(this.gameStates.length < 2) return;

          const stateA = this.gameStates[this.gameStates.length-2];
          const stateB = this.gameStates[this.gameStates.length-1];

          stateA.players.forEach((player) => {
            const currentPlayer = this.players.find((p) => {
              return p.id === player.id
            })
            if(currentPlayer) {
              currentPlayer.mage.fromX = player.x
              currentPlayer.mage.fromY = player.y
            }

          });

          stateB.players.forEach((player) => {
            const currentPlayer = this.players.find((p) => {
              return p.id === player.id
            })
            if(currentPlayer){
              currentPlayer.mage.toX = player.x
              currentPlayer.mage.toY = player.y
            }

          });

          this.calculateTweens(TICK_RATE);


        })

        ////////////////////////////////////////////
        // Listener Config (e.g. spacebar, click) //
        ////////////////////////////////////////////

        // spacebar re-centers the camera on "myPlayer.mage"
        this.input.keyboard.on('keyup-T', (keyPress) => {
            // get this player
            // let myPlayer = this.players.find((player) => {
            //     return player.id == this.myId;
            // })
            let myPlayer = this.players.find(player => player.id == this.myId);

            // if "myPlayer" exists, center the camera on "myPlayer.mage"
            if (myPlayer) {
                this.camera.scrollX = myPlayer.mage.x - this.SCREEN_WIDTH / 2;
                this.camera.scrollY = myPlayer.mage.y - this.SCREEN_HEIGHT / 2;
            }
        });

        this.input.keyboard.on('keyup-SPACE', (keypress) => {
          console.log('shoot fireball!')
        })

        // toggle follscreen on keypress: F
        this.input.keyboard.on('keyup-F', (keyPress) => {
            // if it's fullscreen already, toggle fullscreen off
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            }
            // if it's not fullscreen, toggle fullscreen on
            else {
                this.scale.startFullscreen();
            }
        });

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
                // draw the "click to move" image and debug console logs
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
                }
                this.socket.emit('tryNewMovement', movementInfo)

                // draw the "click to move" image and debug console logs
                this.drawMovementDestinationImage({
                    x: this.input.mousePointer.x + this.camera.scrollX,
                    y: this.input.mousePointer.y + this.camera.scrollY
                });
             }
        }, this);


        ////////////////////
        // BEGIN EASYSTAR //
        ////////////////////

        let easystarArray = [];

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

        // camera arrow keys update
        this.controls.update(delta);

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
        if(player.mage.fromX && player.mage.fromY && player.mage.toX && player.mage.toY) {
          if(player.mage.fromX < player.mage.toX) player.mage.setFlipX(true);
          if(player.mage.fromX > player.mage.toX) player.mage.setFlipX(false);
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
          })
        }

      })

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
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP).add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP).add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP).add(Phaser.Math.Vector2.RIGHT));
            if (easystarArray[destLook.y][destLook.x] === 0) {
                return destLook;
            }
            destLook = destVec.clone();
            destLookArr.push(destLook.add(Phaser.Math.Vector2.UP).add(Phaser.Math.Vector2.RIGHT));
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
}
