import { Sprite, Assets } from "pixi.js";

export class bulletProjectile {
  constructor(bulletX, bulletY, app) {
    this.bulletX = bulletX;
    this.bulletY = bulletY;
    this.app = app;
    this.bulletSpeed = 10;
  }

  async initialiseSprite() {
    // load texture of player, and convert into sprite.
    const texture = await Assets.load('assets/images/bullet.png'); // 'await' keyword used for asynchronous texture loading
    const sprite = Sprite.from(texture);
    sprite.anchor.set(0.5, 0.5); // set anchor point to centre of the sprite

    // initialise x, y to arguements passed through via constructor
    sprite.x = this.bulletX;
    sprite.y = this.bulletY;
    sprite.width = 50;
    sprite.height = 50;
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
    this.bulletX += this.bulletSpeed;
    this.sprite.x = this.bulletX;
  }
}
