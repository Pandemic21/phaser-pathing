import Phaser from 'phaser'

class Projectile extends Phaser.GameObjects.Sprite {
  constructor(config){
      console.log('made a projectile');
      console.log(config);
  }
}
