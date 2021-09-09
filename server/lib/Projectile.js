
 class Projectile extends Phaser.GameObjects.Sprite {
  constructor(scene, {
    owner, //required
    target, //required
    x, //required
    y, //required
    speed = 600, //default 600
    projectileId, //required
    texture = 'fireball' //default to fireball sprite
  })
  {
      super(scene, x, y, texture)
      this.scene = scene
      this.speed = speed
      this.target = target
      this.owner = owner
      this.projectileId = projectileId

      let angle = Phaser.Math.Angle.Between(x, y, target.x, target.y)
      let degAngle = Phaser.Math.RadToDeg(angle);
      this.setSize(32, 32);
      this.setAngle(degAngle);

      scene.add.existing(this);
  }
}

Projectile.prototype.shoot = function() {
  this.scene.physics.moveTo(this, this.target.x, this.target.y, this.speed);
}

window.Projectile = Projectile
