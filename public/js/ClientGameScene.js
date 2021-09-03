export default class ClientGameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        ////////////
        // Images //
        ////////////

        this.load.image('isaacImg', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_04.png');
        this.load.image('isaacBreathe', './assets/sliced/creatures_24x24/oryx_16bit_fantasy_creatures_22.png')

        this.load.image('wall', './assets/sliced/world_24x24/oryx_16bit_fantasy_world_217.png');
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
        map.createLayer('Ground', tileset);

        // "Trees" layer will be second
        let treesLayer = map.createLayer('Trees', tileset);

        // add visual debug to the trees (and where they collide)
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        treesLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });


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


        ////////////////////////////////////////////
        // Listener Config (e.g. spacebar, click) //
        ////////////////////////////////////////////

        // Mouse (left and right mouse click)
        this.input.on('pointerdown', (pointer) => {

            // if RMB (right click)
            if (pointer.rightButtonDown()) {
                // do something if you want
            }

            // if LMB (left click)
            else {
                // TODO: something here
            }
        }, this);
    }


    ////////////
    // Update //
    ////////////

    update() {}
}
