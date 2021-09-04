export default class ClientGameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init(easystar) {
        this.easystar = easystar
    }

    preload() {
        ////////////
        // Images //
        ////////////

        this.load.image('isaacImg', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_04.png');
        this.load.image('isaacBreathe', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_22.png')

        this.load.image('orb', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_42.png');
        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');

        this.load.image('movementClick', './assets/sliced/fx_24x24/oryx_16bit_fantasy_fx2_53.png');


        /////////
        // Map //
        /////////

        this.load.image("base_tiles", "../assets/maps/oryx_world.png")
        this.load.tilemapTiledJSON("tilemap", "../assets/maps/forest_map_small_v2.json")
    }

    create() {
        //////////////////
        // Map Creation //
        //////////////////

        // create the Tilemap
        const map = this.make.tilemap({
            key: 'tilemap',
            tileWidth: 24,
            tileHeight: 24
        })

        // add the tileset image we are using
        const tileset = map.addTilesetImage('oryx_world', 'base_tiles')

        // "Ground" layer will be first
        let ground = map.createLayer('Ground', tileset);

        // "Trees" layer will be second
        let treesLayer = map.createStaticLayer('Trees', tileset);


        ////////////
        // Player //
        ////////////

        //let player = this.physics.add.sprite(50, 50, 'orb')
        let player = this.physics.add.sprite(50, 50, 'isaacImg')

        const PLAYER_SPEED = 120

        // make "Trees" layer collidable with player
        treesLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(player, treesLayer);


        ////////////////////////////////////////////
        // Listener Config (e.g. spacebar, click) //
        ////////////////////////////////////////////

        // Mouse (left and right mouse click)
        this.input.on('pointerdown', (pointer) => {
            const MOVEMENT_SPEED = 150

            // if RMB (right click)
            if (pointer.rightButtonDown()) {
                // do something if you want
            }

            // if LMB (left click)
            else {
                let destination = {
                    x: this.input.mousePointer.x,
                    y: this.input.mousePointer.y
                }

                // draw the "click to move" image for a bit
                this.drawMovementDestinationImage(destination)

                // each tile on the map is 24x24 pixels
                // the pathable map has double the amount of tiles but is the same width/height, so the pixel size for each tile is half (12x12)
                // this translates where the user clicked (raw pixel location on the screen) to where they clicked on the 12x12 tile map/array
                destination.x = Math.floor((destination.x + 0.5) / 12);
                destination.y = Math.floor((destination.y + 0.5) / 12);

                // this does the same as above, but for the player's current position
                let tmpPlayerPosition = {
                    x: Math.floor((player.x + 0.5) / 12), // this translates the player's current real position (in pixels) to
                    y: Math.floor((player.y + 0.5) / 12) // its position in the pathable tile array
                }

                console.log('moving from: (' + tmpPlayerPosition.x + ", " + tmpPlayerPosition.y + ")");
                console.log('-------> to: (' + destination.x + ", " + destination.y + ")");

                // this tells easystar to find a path from (tmpPlayerPosition.x, tmpPlayerPosition.y) --> (destination.x, destination.y)
                // note that those (x, y) coords are on the higher res, pathable tile map
                this.easystar.findPath(tmpPlayerPosition.x, tmpPlayerPosition.y, destination.x, destination.y, (path) => {
                    if (path === null) {
                        console.warn("Path was not found.");
                    } else {
                        console.log(path);

                        // this actually moves the character
                        var tweens = [];
                        for (var i = 0; i < path.length - 1; i++) {
                            var ex = path[i + 1].x;
                            var ey = path[i + 1].y;
                            tweens.push({
                                targets: player,
                                x: {
                                    value: ex * 12, // this translates it from the 12x12 pixel tile map to the larger tile map
                                    duration: PLAYER_SPEED
                                },
                                y: {
                                    value: ey * 12, // this translates it from the 12x12 pixel tile map to the larger tile map
                                    duration: PLAYER_SPEED
                                }
                            });
                        }

                        this.tweens.timeline({
                            tweens: tweens
                        });
                    }
                });
                this.easystar.calculate();
            }
        }, this);


        ////////////////////
        // BEGIN EASYSTAR //
        ////////////////////

        let easystarArray = [];

        for (let i = 0; i < map.height * 2; i++) { // height*2 to double the times to path on
            let arr = []

            for (let j = 0; j < map.width * 2; j++) { // width*2 to double the times to path on

                // there are twice as many pathable tiles are visual tiles.
                // this algorithm translates the current pathable tile to the larger, collidable tile
                let parentX = Math.floor((j + 0.5) / 2)
                let parentY = Math.floor((i + 0.5) / 2)

                if (treesLayer.getTileAt(parentX, parentY) !== null) {
                    arr.push(1); // if there is a tree, arr[j] = 1
                } else {
                    arr.push(0); // if there is NOT a tree, arr[j] = 0
                }

            }
            easystarArray.push(arr);
        }

        console.log("easystarArray width: " + easystarArray[0].length)
        console.log("easystarArray height: " + easystarArray.length)
        console.log(treesLayer)

        this.easystar.setGrid(easystarArray);
        this.easystar.setAcceptableTiles(0);
        this.easystar.enableDiagonals();
        //this.easystar.enableCornerCutting();  // this is interesting, but the player moves faster on the diagonals than the straightaways with it enabled
    }


    ////////////
    // Update //
    ////////////

    update() {}


    moveCharacter(player, destination, path) {
        // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
        var tweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            tweens.push({
                targets: player,
                x: {
                    value: ex * Game.map.tileWidth,
                    duration: 200
                },
                y: {
                    value: ey * Game.map.tileHeight,
                    duration: 200
                }
            });
        }

        this.scene.tweens.timeline({
            tweens: tweens
        });
    }

    drawMovementDestinationImage(destination) {
        // image duration in ms
        const DURATION = 0.5 * 1000
        let clickImg = this.add.image(destination.x, destination.y, 'movementClick');
        clickImg.setScale(2.5, 2.5)

        // this deletes the image after <ms> DURATION
        setTimeout(() => {
            clickImg.destroy()
        }, DURATION)
    }
}
