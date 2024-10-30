import { Sprite, Assets } from "pixi.js";

export class bulletProjectile {
  constructor(bulletX, bulletY, app) {
    this.bulletX = bulletX;
    this.bulletY = bulletY;
    this.app = app;

    // when sliders are implemented, these values should be manipulated roughly 
    this.bulletSpeedX = 100;
    this.bulletSpeedY = 50;
    this.gravity = 5;
  }

  getX() {
    return this.bulletX;
  }

  getY() {
    return this.bulletY;
  }

  async initialiseSprite() {
    // load texture of player, and convert into sprite.
    const texture = await Assets.load('assets/images/bullet.png'); // 'await' keyword used for asynchronous texture loading
    const sprite = Sprite.from(texture);
    sprite.anchor.set(0.5, 0.5); // set anchor point to centre of the sprite

    // initialise x, y to arguements passed through via constructor
    sprite.x = this.bulletX;
    sprite.y = this.bulletY;
    sprite.width = 30;
    sprite.height = 30;
    this.sprite = sprite;
  }

  getSprite() {
    if (this.sprite) {
      console.log("Sprite initialised!");
      return this.sprite;
    } else {
      console.log("Sprite not initialised!");
    }
  }

  updateBullet() {
    this.bulletX += this.bulletSpeedX;
    this.sprite.x = this.bulletX;

    this.bulletY -= this.bulletSpeedY;
    this.sprite.y = this.bulletY;
  }

  applyGravityToVerticalMotion() {
    this.bulletSpeedY -= this.gravity;
  }
}
