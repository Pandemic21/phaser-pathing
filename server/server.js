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
        spellHelper = window.spellHelper;
        __dirname = window.__dirname;
        easystarjs = window.easystarjs;
        this.easystar = new easystarjs.js();

        // This is the code in ClientGameScene.js:
        //  this.load.image("base_tiles", "../public/assets/maps/oryx_world.png")
        //  this.load.tilemapTiledJSON("tilemap", "../assets/maps/forest_map_small.json")

        //this.load.tilemapTiledJSON("tilemap", "file:///" + __dirname + "/public/assets/maps/forest_map_small.json");
        this.load.tilemapTiledJSON("tilemap", "file:///" + __dirname + "/public/assets/maps/forest_map_small_v2.json");
    }

    create() {
        /* Contains:
         *    Constants
         *    Game Variables
         *    Create Map
         *    Socket.io Config
         *    Socket.io Functions
         */

        ///////////////
        // Constants //
        ///////////////

        var self = this


        ////////////////////
        // Game Variables //
        ////////////////////

        let projectileId = 0 //this is incremented after given to each projectile.

        // socket connection / packets
        this.clients = {};
        this.pushbackTarget = {};

        // zones (burning zones, speed boost zones... circles that have ongoing effects)
        this.zones = [];
        // physics objects
        this.players = this.physics.add.group({
            collideWorldBounds: true
        });
        this.projectiles = this.physics.add.group();
        this.targets = this.physics.add.group();
        this.trees = this.physics.add.group();
        this.knockbackTarget = {};

        // map each element to a name (for readability only)
        // for example:
        //  this.currentMana[this.manaData.fire] = this.currentMana[this.manaData.fire] - 3
        this.manaData = new Map();
        this.manaData.fire = 0
        this.manaData.water = 1
        this.manaData.earth = 2
        this.manaData.air = 3
        this.manaData.light = 4
        this.manaData.dark = 5

        this.currentMana = []
        // this time never stops counting up
        this.gameTime = 0;

        // this timer is for mana regeneration. TODO: rename it
        this.timer = 0;


        ////////////////
        // Create Map //
        ////////////////

        // TODO: implement server-side map

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
        // create the (invisible) trees layer and add collision
        this.treesLayer = this.map.createStaticLayer('Trees', tileset);
        //this.map.setCollisionBetween(1, 999, true, 'Trees');


        this.lastTarget = null;

        // 2d array representing all map terrain where 1 = unpathable, 0 = pathable
        let easystarArray = [];

        for (let i = 0; i < this.map.height; i++) {
            let arr = []
            for (let j = 0; j < this.map.width; j++) {
                if (this.treesLayer.getTileAt(j, i) !== null) {
                    arr.push(1); // if there is a tree, arr[j] = 1
                } else {
                    arr.push(0); // if there is NOT a tree, arr[j] = 0
                }

            }
            easystarArray.push(arr);
        }

        this.easystarArray = easystarArray
        this.easystar.setGrid(this.easystarArray);
        this.easystar.setAcceptableTiles(0);
        this.easystar.enableDiagonals();
        //this.easystar.enableCornerCutting();

        this.physics.world.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);

        //////////////////////
        // Socket.io Config //
        //////////////////////

        // on Socket.io connection
        window.io.on('connection', (socket) => {
            console.log('user connected: ' + socket.id);

            this.onConnection(socket);

            // send the clients object to the new player
            socket.emit('currentPlayers', this.clients);
            // update all other clients of the new player
            socket.broadcast.emit('newPlayer', this.clients[socket.id]);


            /////////////////////////
            // Socket.io Functions //
            /////////////////////////

            /*  Function: "disconnect"
                Triggered: on socket disconnect (e.g. player left game)
                Result:
                    - tells clients to remove the player from their screen
                    - disconnects the server side socket
            */
            socket.on('disconnect', (() => {
                console.log('user disconnected: ' + socket.id);
                socket.broadcast.emit('removePlayer', socket.id);

                this.removePlayer(socket);
                // disconnect the socket
                socket.disconnect(true);
            }));


            /* Function: checkSettings(<array> settings)
                Triggered:
                    start of ClientGameScene.js
                Returns:
                    <bool> true - if settings are parsed successfully
                    <bool> false - if settings are unsuccessfully parsed
                Results:
                    sets some sorver-side configs based on client input.
                    THIS IS DANGEROUS. read the last line again, slowly. DANGER.
            */
            socket.on('checkSettings', ((settings) => {
                if (settings.infiniteManaHack) this.clients[socket.id].infiniteManaHack = true
            }))
            /*  Function: "tryIsaacMovement"
                Triggered: when a player tries to move their isaac
                Result:
                    - moves the player physics object to the player mouse location
                    - TODO: this returns true/false, make that important or something
            */
            socket.on('tryIsaacMovement', (movementData) => {
                this.moveIsaac(socket, movementData);
            });

            /* Function: tryCastBurn
                Trigged:
                    by ClientGameScene.js when they cast the burn spell
                Result:
                    searches the area near targetData (within range) and burns target
            */
            socket.on('tryCastBurn', (targetData) => {
                this.castBurn(socket, targetData)
            })

            socket.on('tryCastExplosion', (manaRequirements, targetData) => {
                // get the player who is casting
                let castingPlayer = this.clients[socket.id]

                // if the player does not have the mana to cast the spell, return false
                if (!SpellHelper.checkMana(castingPlayer, manaRequirements)) {
                    return false;
                }

                // if they do have the mana to cast it, spend their mana
                SpellHelper.setCurrentMana(socket, castingPlayer, manaRequirements)

                // cast the explosion
                this.castExplosion(socket, manaRequirements, targetData)
            })


            socket.on('tryCastProjectile', (manaRequirements, movementData) => {
                // the client wants to cast a (projectile) spell
                // the client wants to spent (<array> manaRequirements) on the spell
                let castingClient = this.clients[socket.id]

                // if the player does not have the mana to cast the spell, return false
                if (!SpellHelper.checkMana(castingClient, manaRequirements)) {
                    return false;
                }

                // if they do have the mana to cast it, spend their mana
                SpellHelper.setCurrentMana(socket, castingClient, manaRequirements)

                // set the sourceX and sourceY based on what the server thinks
                // the castingClient's (x,y) is
                movementData.sourceX = castingClient.isaacX
                movementData.sourceY = castingClient.isaacY

                // cast the projectile
                // this also adds any element modifiers
                // (e.g. burning, knockback, etc...)
                this.castProjectile(socket, manaRequirements, movementData, projectileId)
                projectileId = projectileId + 1;

                // emit animations to clients
                // TODO: change this to animate based on what elements went into the spell
                socket.emit("createProjectile", {
                    movementData,
                    manaRequirements
                })
                socket.broadcast.emit("createProjectile", {
                    movementData,
                    manaRequirements
                })

                return true;
            })
        });
    }


    update(time, delta) {
        const socket = window.io;

        this.destroyOutOfBounds(socket);
        this.physics.collide(this.players, this.treesLayer)

        //////////////////////////////
        // Click to Move Code (2/2) //
        //////////////////////////////

        // get each player's target destination
        this.players.getChildren().forEach((player) => {
            if (player) {
                //check player hp, kill them if dead
                if (player.hp <= 0) {
                    socket.emit('killPlayer', player.name);
                    player.destroy();
                    return false;
                }
                let target = this.targets.getChildren().find((target) => {
                    return target.name === player.name;
                })

                // if a target destination doesn't exist, set it to the player's location
                if (!target) {
                    target = {
                        x: player.x,
                        y: player.y
                    }
                }
                // Check if player is in a zone
                for (let i = 0; i < this.zones.length; i++) {
                    // if the zone's duration has expired, remove it from <array>zones via splice()
                    if (this.zones[i].START_TIME + this.zones[i].DURATION < this.gameTime) {
                        this.zones.splice(i, 1);
                    }

                    // else, the zone is still in effect
                    else {
                        let distance = Phaser.Math.Distance.Between(player.x, player.y, this.zones[i].position.x, this.zones[i].position.y);

                        // if the player is in the zone
                        if (distance < this.zones[i].radius) {
                            // check for the zone effect
                            if (this.zones[i].effect == 'speedup') {
                                // TODO: increase isaac's speed while he's in the zone

                            }

                            if (this.zones[i].effect == 'burning') {
                                player.burning = {
                                    isBurning: true,
                                    burnDmg: this.zones[i].num // since zones can be anything, "num" in generic damage/healing/etc
                                }
                            }
                        }
                    }
                }

                // Player Knockback
                if (player.knockback && player.knockback.isKnockback) {
                    player.knockback.isKnockback = false;

                    let knockbackAngle = player.knockback.knockbackAngle;

                    //these are trig functions that find a point from incoming values of DISTANCE, ANGLE,
                    // and POINT OF ORIGIN which is exactly what we want
                    const knockbackTargetX = player.knockback.distance * Math.cos(knockbackAngle) + player.x;
                    const knockbackTargetY = player.knockback.distance * Math.sin(knockbackAngle) + player.y;

                    //we add the knockback target that we calculated to this object below,
                    // its going to replace the normal movement target
                    this.knockbackTarget[player.name] = {
                        x: knockbackTargetX,
                        y: knockbackTargetY
                    };

                    /*
                        This line and the previous line are how we should be calculating
                        the movement targets in the first place. We currently have
                        gameobjects that we are doing moveToObject towards. This is
                        unnecessary overhead, because we only need to keep the x and y coords.
                        im not gonna fix that right now or probably not soon either, but if i remember when my focus ends
                        ill make an issue.
                    */

                    this.physics.moveTo(player, knockbackTargetX, knockbackTargetY, 600);

                }

                // Burning Damage
                if (player.burning && player.burning.isBurning) {
                    //calculate burns here.
                    if (!player.burning.burnTime) {
                        player.burning.ticksLeft = player.burning.burnDmg / 5
                        player.burning.burnTime = player.burning.ticksLeft * 1000;
                        // this is how many ticks     this is the tickrate
                    } else {
                        player.burning.burnTime -= delta;
                        if (Math.ceil(player.burning.burnTime / 1000) < player.burning.ticksLeft) {
                            //time to tick
                            this.doDamage(player, 5);
                            player.burning.ticksLeft -= 1;
                            player.burning.burnDmg -= 5;
                        }
                    }

                    if (player.burning.ticksLeft === 0) {
                        player.burning = {
                            isBurning: false,
                            burnDmg: 0
                        }
                    }
                }

                // Player Pushback
                if (this.knockbackTarget[player.name]) {
                    target = this.knockbackTarget[player.name];
                }

                let targetTile = this.groundLayer.getTileAtWorldXY(target.x, target.y, true);
                let playerTile = this.groundLayer.getTileAtWorldXY(player.x, player.y, true);

                if (this.lastTarget === null) {
                    this.lastTarget = {
                        x: targetTile.x,
                        y: targetTile.y
                    }
                }

                //this should be always making sure our target is a walkable location
                // needs further testing

                // while(targetTile.index !== -1){
                //     let angle = Phaser.Math.Angle.Between(target.x, target.y,
                //         player.x, player.y);

                //     target.x = target.x + Math.cos(angle) * 26;
                //     target.y = target.y + Math.sin(angle) * 26;

                //     targetTile = this.treesLayer.getTileAtWorldXY(target.x, target.y, true);

                // }

                if(this.knockbackTarget[player.name]) {
                    player.path = null;
                    target = this.knockbackTarget[player.name];
                }

                var distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);

                if(!this.knockbackTarget[player.name] && this.prevDistance && distance !== 0 && distance >= this.prevDistance) {
                    this.physics.moveTo(player, target.x, target.y, 200)
                }

                this.prevDistance = distance;

                if (player.body.speed > 0) {
                    // distance tolerance, i.e. how close the source can get to the target
                    // before it is considered as being there. The faster it moves, the more tolerance is required.
                    if (distance < player.body.speed / 50) {
                        // Now when we are actually snapping to the desired location, we can delete the
                        //  knockbackTarget attached to this player.
                        // NOTE: the knockback status was already deleted.
                        if (this.knockbackTarget[player.name]) {
                            delete this.knockbackTarget[player.name];
                        }

                        player.body.reset(target.x, target.y);

                        //go to next node in the path and update path
                        if (player.path && player.path.length > 0) {
                            let pathTarget = this.groundLayer.tileToWorldXY(player.path[0].x, player.path[0].y);
                            target.x = pathTarget.x;
                            target.y = pathTarget.y;
                            this.physics.moveTo(player, pathTarget.x, pathTarget.y, 200);
                            player.path.shift();
                        }

                    }
                }
                // Player Casting
                if (player.casting.isCasting) {
                    player.body.reset(player.x, player.y);
                    socket.emit('setCasting', {
                        castTime: player.casting.castTime,
                        playerId: player.name,
                        playerLocation: {
                            x: player.x,
                            y: player.y
                        }
                    });
                }
                // emit isaac movement
                var x = player.x;
                var y = player.y;
                var r = player.rotation;
                var hp = player.hp
                var burning = false;
                if (player.burning) burning = player.burning.isBurning

                // send the new position to all clients
                socket.emit('setIsaacMovement', {
                    isaacRot: r,
                    isaacX: x,
                    isaacY: y,
                    playerId: player.name,
                    hp,
                    burning
                });


                // save old position data
                player.oldPosition = {
                    x,
                    y,
                    rotation: r,
                };


            }
        })

        // update this.clients for easy access
        // this updates this.clients[key].isaacX and .issacY, which are used when casting spells.
        for (const clientKey in this.clients) {

            // get the player object associated with this client
            let player = this.players.getChildren().find((player) => {
                return player.name === clientKey;
            })

            // update the x,y of isaac
            // this is is a try/catch block because if the player is of the screen and this tries to update it we get problems
            try {
                this.clients[clientKey].isaacX = player.x
                this.clients[clientKey].isaacY = player.y
            } catch (error) {}
        }


        ////////////////
        // Mana Regen //
        ////////////////

        this.timer += delta;
        this.gameTime += delta;

        if (this.timer > SpellHelper.MANA_REGEN_TIME) {
            this.timer = 0;

            SpellHelper.regenMana(socket, this.players, this.clients)
        }
    }


    //////////////////////
    // Custom Functions //
    //////////////////////

    onConnection(socket) {
        // create a new player and add it to our clients object
        //  these will serve as packets, so keep them simple.
        const TILE_SIZE = 24    // tile size in px
        const SPAWN_AREA_WIDTH = 720/TILE_SIZE
        const SPAWN_AREA_HEIGHT = 480/TILE_SIZE

        //let tmpX = Phaser.Math.Between(0, SPAWN_AREA_WIDTH)*TILE_SIZE+TILE_SIZE/2;
        //let tmpY = Phaser.Math.Between(0, SPAWN_AREA_HEIGHT)*TILE_SIZE+TILE_SIZE/2;
        let tmpX = TILE_SIZE*4+TILE_SIZE/2
        let tmpY = TILE_SIZE*4+TILE_SIZE/2

        console.log('tmpX, tmpY: ' + tmpX + ", " + tmpY)


        this.clients[socket.id] = {
            isaacHp: this.findHp(socket.id),
            isaacRot: 0,
            // isaacX: Math.floor(Math.random() * 700) + 50,
            // isaacY: Math.floor(Math.random() * 500) + 50,
            isaacX: tmpX,
            isaacY: tmpY,
            playerId: socket.id,
            MAX_MANA: 3,
            currentMana: [
                3, /* Fire     */
                3, /* Water    */
                3, /* Earth    */
                3, /* Air      */
                3, /* Light    */
                3 /*  Dark    */
            ]
        };

        //create the server side phaser object for physics checking
        let player = this.physics.add.sprite(this.clients[socket.id].isaacX, this.clients[socket.id].isaacY)

        player.hp = this.clients[socket.id].isaacHp;
        player.path = null;

        const target = this.add.sprite(this.clients[socket.id].isaacX, this.clients[socket.id].isaacY);

        player.name = socket.id;
        player.casting = {
            isCasting: false,
            castTime: 0
        };
        target.name = socket.id;
        this.players.add(player);
        this.targets.add(target);

    }

    removePlayer(socket) {
        // remove the player's gameObject
        const player = this.players.getChildren().find((player) => {
            return player.name === socket.id;
        })

        if (player) player.destroy();
        // remove this player from our clients object
        delete this.clients[socket.id];
    }

    moveIsaac(socket, movementData) {

        const player = this.players.getChildren().find((player) => {
            return player.name === socket.id;
        })

        let target = this.targets.getChildren().find((target) => {
            return target.name === socket.id;
        })

        if (player === undefined) {
            return false;
        }

        // if the player has no target, make one
        if (target === undefined) {
            target = this.add.sprite(movementData.destX, movementData.destY);
            this.targets.add(target);
        }
        // or just update it
        else {
            target.x = movementData.destX;
            target.y = movementData.destY;
        }

        let targetTile = this.groundLayer.getTileAtWorldXY(target.x, target.y, true);   // the tile the player wants to go to
        let playerTile = this.groundLayer.getTileAtWorldXY(player.x, player.y, true);   // the tile the player is currently on

        this.easystar.findPath(playerTile.x, playerTile.y, targetTile.x, targetTile.y, (path) => {
            if (path === null) {
                console.log('pathing failed ', playerTile.x, playerTile.y, targetTile.x, targetTile.y)
            }
            if (path !== null && path.length > 0) {
                player.path = path;
                if (!player.casting.isCasting) {
                    let pathTarget = this.groundLayer.tileToWorldXY(player.path[0].x, player.path[0].y);
                    target.x = pathTarget.x;
                    target.y = pathTarget.y;

                    if(player.active){
                        this.physics.moveTo(player, pathTarget.x, pathTarget.y, 200);
                        player.path.shift();
                    }

                }
            }
        });

        if (this.lastTarget.x !== targetTile.x && this.lastTarget.y !== targetTile.y) {
            try {
                this.easystar.calculate();
            } catch (err) {
                console.log('ERROR: ' + err)
            }
        }

        this.lastTarget = {
            x: targetTile.x,
            y: targetTile.y
        }

        //status checks for stun/slow/casting can go here
        // if (!player.casting.isCasting) {
        //     if(player.path && player.path.length > 0) {
        //         let pathTarget = this.groundLayer.tileToWorldXY(player.path[0].x, player.path[0].y);
        //         console.log('moving to ', pathTarget.x, pathTarget.y);
        //         target.x = pathTarget.x;
        //         target.y = pathTarget.y;
        //         this.physics.moveToObject(player, pathTarget, 200);
        //         player.path.shift();
        //     } else {
        //         this.physics.moveToObject(player, target, 200)
        //     }

        // }

    }

    castBurn(socket, targetData) {
        const MAX_DISTANCE = 400 // circle radius in pixels
        const BURN_OWNER = socket.id;

        // check the distance between each player and the target
        this.players.getChildren().forEach((player) => {
            if (BURN_OWNER !== player.name) {
                // calculate the distance between the player and the target of the burn
                let distance = Phaser.Math.Distance.Between(player.x, player.y, targetData.x, targetData.y);

                // if the player is close enough to the burn, do damage
                if (distance < MAX_DISTANCE) {
                    this.doDamage(player, 10)
                    socket.emit('playerHit', {
                        playerId: player.name,
                        playerHp: player.hp
                    });
                    socket.broadcast.emit('playerHit', {
                        playerId: player.name,
                        playerHp: player.hp
                    });
                }
            }
        })
    }


    /*
    castExplosion(socket, manaRequirements, {
        targetData,
        radius
    }) {
    */


    /* Function: castExplosion(socket, manaRequirements, targetData)
     *    Parameters:
     *        <socket> socket - the socket, obviously
     *        <array> manaRequirements - an array of mana requirements the client sent, e.g. [2,1,0,0,0,0]
     *        <obj> targetData
     *            targetData.x = x position
     *            targetData.y = y position
     *            targetData.radius = radius of the explosoin
     *    Triggered:
     *        called by socket.on('tryCastExplosion') by ClientGameScene.js
     *    Returns:
     *        <bool> true - if successful
     *        <bool> false - if unsuccessful
     *    Results:
     *        this attaches effects and damage to the spell.
     *        at the end it calls createExplosion(socket, manaRequirements, targetData) to actually create the explosion
     */
    castExplosion(socket, manaRequirements, targetData) {
        // cast the explosion

        // TODO: MAX_DISTANCE should come from "targetData.radius", but that's messed up.
        // changing targetData.radius in ClientGameScene.js causes the animation to be bugged.
        // temporarily hard coded at 65+12 for magic number
        const MAX_DISTANCE = 65 + 12 // search distance pixels.
        targetData.radius = MAX_DISTANCE
        const EXPLOSION_OWNER = socket.id;
        const CAST_TIME = 750; //in milliseconds

        let owner = this.players.getChildren().find((player) => {
            return player.name === EXPLOSION_OWNER;
        })

        // if the owner is already casting, don't cast again
        if (owner.casting.isCasting) {
            return false;
        }

        // set the owner to casting
        owner.casting.isCasting = true;
        owner.casting.castTime = CAST_TIME;

        //let castingClient = this.clients[socket.id]
        this.players.getChildren().forEach((player, i) => {
            if (player.name == EXPLOSION_OWNER) {
                player.casting.isCasting = true;
                player.casting.castTime = CAST_TIME;
            }
        });

        // set casting to clients
        socket.emit('setCasting', {
            castTime: CAST_TIME,
            playerId: EXPLOSION_OWNER,
            playerLocation: {
                x: owner.x,
                y: owner.y
            }
        })
        socket.broadcast.emit('setCasting', {
            castTime: CAST_TIME,
            playerId: EXPLOSION_OWNER,
            playerLocation: {
                x: owner.x,
                y: owner.y
            }
        })

        // delay for <ms> CAST_TIME, then call "this.createExplosion()"
        setTimeout(() => {
            let hitCreatures = []
            hitCreatures = this.createExplosion(socket, manaRequirements, targetData, MAX_DISTANCE, owner)

            // iterate through each of the <array> hitCreatures and: (1) apply element effect to the creatures, and (2) do damage
            for (let k = 0; k < hitCreatures.length; k++) {
                // apply element effect
                // minimum 2 fire in damaging explosions (slots 1 and 3)
                if (manaRequirements[this.manaData.fire] > 2) {
                    console.log('fire explosion')

                    hitCreatures[k].burning = {
                        isBurning: true,
                        burnDmg: 10
                    }
                }

                // do damage
                this.doDamage(hitCreatures[k], 10)
                socket.emit('playerHit', {
                    playerId: hitCreatures[k].name,
                    playerHp: hitCreatures[k].hp
                });
                socket.broadcast.emit('playerHit', {
                    playerId: hitCreatures[k].name,
                    playerHp: hitCreatures[k].hp
                });
            }


            // some elements have effects other than damage, they go here
            // if there's air in the spell, leave a speed boost
            if (manaRequirements[this.manaData.air] > 0) {
                const DURATION = 4000 // time in <ms>

                socket.emit('createCircle', {
                    targetData,
                    DURATION,
                    fillColor: 0x63e989,
                    lineColor: 0x76b43f
                })
                socket.broadcast.emit('createCircle', {
                    targetData,
                    DURATION,
                    fillColor: 0x63e989,
                    lineColor: 0x76b43f
                })

                // create the new zone to check in update(), then push it to <array> zones
                let zoneData = {};
                zoneData.DURATION = DURATION;
                zoneData.START_TIME = this.gameTime
                zoneData.position = targetData.position
                zoneData.radius = targetData.radius
                zoneData.effect = 'speedup'
                zoneData.num = 50

                this.zones.push(zoneData)
            }

            // if it's triple fire, add a burning area
            if (manaRequirements[this.manaData.fire] > 2) {
                const DURATION = 10000 // time in <ms>

                socket.emit('createCircle', {
                    targetData,
                    DURATION,
                    fillColor: 0xe41251,
                    lineColor: 0x6a0000
                })
                socket.broadcast.emit('createCircle', {
                    targetData,
                    DURATION,
                    fillColor: 0xe41251,
                    lineColor: 0x6a0000
                })

                // create the new zone to check in update(), then push it to <array> zones
                let zoneData = {};
                zoneData.DURATION = DURATION;
                zoneData.START_TIME = this.gameTime
                zoneData.position = targetData.position
                zoneData.radius = targetData.radius
                zoneData.effect = 'burning'
                zoneData.num = 20

                this.zones.push(zoneData)
            }
        }, CAST_TIME)
    }


    /* Function: createExplosion(socket, manaRequirements, targetData)
     *    Parameters:
     *        <socket> socket - the socket, obviously
     *        <array> manaRequirements - an array of mana requirements the client sent, e.g. [2,1,0,0,0,0]
     *        <obj> targetData
     *            targetData.x = x position
     *            targetData.y = y position
     *            targetData.radius = radius of the explosoin
     *    Triggered:
     *        called by socket.on('tryCastExplosion') by ClientGameScene.js
     *    Returns:
     *        <array> hitCreatures - creatures (including players / mages) who were hit by the explosion
     *    Results:
     *        this does not do damage. This just calculates the creatures (includes mages) who were hit and returns them.
     *        damage is dealt in castExplosion()
     */
    createExplosion(socket, manaRequirements, targetData, MAX_DISTANCE, owner) {
        // creatues (including players) hit by the explosion
        let hitCreatures = []

        socket.broadcast.emit('setExplosion', {
            manaRequirements,
            targetData,
            owner: socket.id
        });
        socket.emit('setExplosion', {
            manaRequirements,
            targetData,
            owner: socket.id
        });

        // check the distance between each player and the target
        this.players.getChildren().forEach((player) => {
            if (socket.id !== player.name) {
                // calculate the distance between the player and the target of the burn
                let distance = Phaser.Math.Distance.Between(player.x, player.y, targetData.position.x, targetData.position.y);

                // if the player is close enough to the burn, do damage
                if (distance < MAX_DISTANCE) {
                    hitCreatures.push(player)
                }
            }
        })

        // owner is no longer casting
        owner.casting.isCasting = false;
        owner.casting.castTime = 0;

        socket.broadcast.emit('stopCasting', owner.name);
        socket.emit('stopCasting', owner.name)

        return (hitCreatures)
    }


    castProjectile(socket, manaRequirements, movementData, projectileId) {
        let castingPlayer = this.clients[socket.id]

        this.createProjectile(socket, movementData, projectileId, (player, projectile) => {
            //This is a callback function that is executed on a hit

            // if there's fire in the projectile, add burning
            if (manaRequirements[this.manaData.fire] > 1) {
                player.burning = {
                    isBurning: true,
                    burnDmg: 10
                }
            }

            // if there's air in the spell, knockback the target and caster
            if (manaRequirements[this.manaData.air] > 1) {

                // let knockbackAngle = Phaser.Math.Angle.Reverse(Phaser.Math.DegToRad(projectile.angle));

                // const currentPlayer = this.players.getChildren().find((player) => {
                //     return player.name === projectile.owner;
                // });

                // currentPlayer.knockback = {
                //     isKnockback: true,
                //     distance: 100,
                //     movementData,
                //     knockbackAngle,
                // }

                let knockbackAngle = Phaser.Math.DegToRad(projectile.angle);
                player.knockback = {
                    isKnockback: true,
                    distance: 30,
                    movementData,
                    knockbackAngle
                }
            }
        });

        return true;
    }


    createProjectile(socket, movementData, projectileId, onHit = () => {}) {
        const origin = {
            x: movementData.sourceX,
            y: movementData.sourceY
        };
        const target = {
            x: movementData.destX,
            y: movementData.destY
        };
        let angle = Phaser.Math.Angle.Between(origin.x, origin.y, target.x, target.y)
        angle = Phaser.Math.RadToDeg(angle);


        const checkAlive = this.players.getChildren().find((player) => {
            return player.name === socket.id;
        })

        if (checkAlive === undefined || !checkAlive.active) {
            return false;
        }

        const projectile = this.physics.add.sprite(origin.x, origin.y)
            .setOrigin(0.5, 0.5).setAngle(angle);
        //looks cooler if stuff just flies offscreen;
        projectile.setCollideWorldBounds(false);
        //dimensions are 32x32
        projectile.setSize(32, 32);
        //attach target point to game object for update purposes
        projectile.target = {
            x: target.x,
            y: target.y
        };
        //attach id
        projectile.id = projectileId;
        //adds ownership
        projectile.owner = socket.id;
        //add to projectiles group
        this.projectiles.add(projectile);

        this.physics.moveToObject(projectile, target, 800); //this should be a projectile speed variable

        movementData.id = projectile.id; //attach this id to the packet

        // Colliders!!
        this.players.getChildren().forEach((player) => {
            if (projectile.owner !== player.name) {

                this.physics.add.overlap(projectile, player, () => {
                    this.doDamage(player, 10)
                    onHit(player, projectile);
                    socket.emit('playerHit', {
                        playerId: player.name,
                        playerHp: player.hp
                    });
                    socket.broadcast.emit('playerHit', {
                        playerId: player.name,
                        playerHp: player.hp
                    });
                    const projectileData = {
                        x: projectile.x,
                        y: projectile.y,
                        angle: projectile.angle,
                        id: projectile.id
                    }
                    socket.emit('removeProjectile', projectileData);
                    socket.broadcast.emit('removeProjectile', projectileData);
                    projectile.destroy();
                })
            }

        })

        return projectile
    }


    destroyOutOfBounds(socket) {
        // get each player's projectiles
        this.projectiles.getChildren().forEach((projectile) => {
            if (projectile) {
                //get rid of projectile when its off screen
                const projectileData = {
                    x: projectile.x,
                    y: projectile.y,
                    angle: projectile.angle,
                    id: projectile.id
                }

                if (projectile.x > 850 || projectile.y > 650 || projectile.x < -50 || projectile.y < -50) {
                    projectile.destroy();
                    socket.emit('removeProjectile', projectileData)
                } else {
                    socket.emit('setProjectile', projectileData);
                }
            }
        })
    }

    doDamage(player, amt) {
        player.hp = player.hp - amt;
        this.clients[player.name].isaacHp = player.hp;
    }

    findHp(playerId) {
        let tmpPlayer = this.players.getChildren().find((player) => {
            return player.name === playerId;
        })
        if (tmpPlayer) {
            return tmpPlayer.hp;
        } else {
            return 100;
        }

    }

}



/*  TODO
Eventually we'll probably want to move this to a separate file.
It's currently in this file because there's strangeness when you try to import it
from index.html, due to JSDom behaviors.
*/
let SpellHelper = class {
    constructor() {}

    static MAX_MANA = 3
    static NUM_ELEMENTS = 6
    static MANA_REGEN_TIME = 2000 // time in MS before the players regen 1 of each mana


    /* Function: checkMana(castingPlayer, manaRequirements)
    *    Parameters:
    *        castingPlayer - obj - the player casting the spell
    *        manaRequirements - array - an array to be cross-referenced with currentPlayer's mana to see if they have mana to cast the spell
    *    Triggered:
    *        when a player tries to cast a spell
    *    Returns:
    *        true - if the player can cast the spell
    *        false - if the player CANNOT cast the spell

    Here's an example of using this function:

        let castingPlayer = this.clients[socket.id]
        let manaRequirements = [0,0,0,0,0,0]
        manaRequirements[this.manaData.fire] = 2
        manaRequirements[this.manaData.air] = 1

        let playerHasManaToCastSpell = SpellHelper.checkMana(castingPlayer, manaRequirements)

        // if the player does not have the mana to cast the spell, return false
        if(!playerHasManaToCastSpell) {
            return false;
        }

        // if they do have the mana to cast it, spend their mana
        SpellHelper.setCurrentMana(castingPlayer, manaRequirements)

    */
    static checkMana(castingPlayer, manaRequirements) {
        for (let k = 0; k < manaRequirements.length; k++) {
            // if the spell requires 0 mana from this element, continue to the next element.
            if (manaRequirements[k] == 0) {
                continue;
            }

            // if the mana requirements would put the player's currentMana into negative numbers
            if ((castingPlayer.currentMana[k] - manaRequirements[k]) < 0) {
                return false;
            }
        }
        // if we got here we can cast the spell, return true
        return true;
    }


    /* Function: checkMana(castingPlayer, manaRequirements)
     *    Parameters:
     *        castingPlayer - obj - the player casting the spell
     *        manaRequirements - array - an array with the mana cost for each element, to be subtracted from the currentPlayer's currentMana
     *    Triggered:
     *        when a player SUCCESSFULLY casts a spell
     *    Returns:
     *        <array> castingPlayer.currentMana
     */
    static setCurrentMana(socket, castingPlayer, manaRequirements) {
        for (let k = 0; k < manaRequirements.length; k++) {
            castingPlayer.currentMana[k] = castingPlayer.currentMana[k] - manaRequirements[k]
        }
        // this gives players infinite mana, if they have <bool> infiniteManaHack == true
        if (castingPlayer.infiniteManaHack) castingPlayer.currentMana = [3, 3, 3, 3, 3, 3]


        // tell the client what their new mana value is, and to redraw it
        socket.emit('redrawMana', castingPlayer.currentMana)

        return castingPlayer.currentMana
    }


    /* Function: regenMana(clients)
    *    Parameters:
    *        clients - obj - each connected client
    *    Triggered:
    *        by the server every SpellHelper.MANA_REGEN_TIME ms
    *    Returns:
    *        <bool> true, if successful
             <bool> false, if unsuccessful
         Results:
            Changes each player's currentMana, by increasing the currentMana of each element by 1
    */
    static regenMana(socket, players, clients) {
        // if no players are connected to the server yet
        if (players == undefined) {
            return false;
        }

        // cycle through all the players, updating their mana
        for (const clientKey in clients) {
            //let currentPlayer = clients[clientKey]

            for (let k = 0; k < SpellHelper.NUM_ELEMENTS; k++) {
                // if increasing their current mana by 1 puts them over the max mana, continue
                if (clients[clientKey].currentMana[k] + 1 > SpellHelper.MAX_MANA) {
                    continue;
                }
                clients[clientKey].currentMana[k] = clients[clientKey].currentMana[k] + 1
            }
            socket.emit('redrawMana', clients[clientKey].currentMana)
        }
    }
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
