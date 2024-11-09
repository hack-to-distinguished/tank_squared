import { Assets, Sprite } from "pixi.js";
import { bulletProjectile } from "./bullet";

export class tankPlayer {
  constructor(playerX, playerY, app) {
    // setup the x, y co-ordinates
    this.app = app;
    this.playerX = playerX;
    this.playerY = playerY;
    this.playerSpeed = 5;
    this.keys = {}; // dict setup
    this.bullets = [];
  }

  getX() {
    return this.playerX;
  }

  getY() {
    return this.playerY;
  }

  async createBullet() {
    const bullet = new bulletProjectile(this.playerX, this.playerY, this.app);
    await bullet.initialiseBulletSprite();
    this.app.stage.addChild(bullet.getSprite());
    this.addBulletToBullets(bullet);
  }

  updateBullets() {
    for (let i = 0; i < this.getBulletsList().length; i++) {
      const projectile = this.getBulletsList()[i];
      projectile.applyGravityToVerticalMotion();
      projectile.updateBullet();

      // check if bullet has gone off the screen, if it has, then it will be deleted. 
      if (projectile.getX() > (this.app.canvas.width + 20) || projectile.getX() < 0) {
        this.app.stage.removeChild(projectile);
        this.getBulletsList().splice(i, 1);
      }
    }
  }

  getBulletsList() {
    return this.bullets;
  }

  addBulletToBullets(bullet) {
    this.bullets.push(bullet);
  }

  async initialisePlayerSprite() {

    // load texture of player, and convert into sprite.
    const playerTexture = await Assets.load('assets/images/tank.png');
    const playerSprite = Sprite.from(playerTexture);
    playerSprite.anchor.set(0.5, 0.5); // set anchor point to centre of the sprite

    // resizing the texture
    const desiredWidth = 150;
    const desiredHeight = 105;
    playerSprite.scale.set(desiredWidth / playerTexture.width, desiredHeight / playerTexture.height); // set the scale so there is no sprite distortion

    // initialise x, y to arguements passed through via constructor
    playerSprite.x = this.playerX;
    playerSprite.y = this.playerY;
    this.playerSprite = playerSprite;
  }

  getSprite() {
    if (this.playerSprite) {
      return this.playerSprite;
    }
  }

  checkSpaceBarInput() {
    if (this.keys['32']) {
      return true;
    } else {
      return false;
    }
  }

  updatePlayerPosition() {
    // console.log(this.keys);
    this.playerSprite.x = this.playerX;
    this.playerSprite.y = this.playerY;
    if (this.keys['68']) {
      this.playerX += this.playerSpeed;
      this.playerSprite.scale.x = Math.abs(this.playerSprite.scale.x); // make sprite face right
    } else if (this.keys['65']) {
      this.playerX -= this.playerSpeed;
      this.playerSprite.scale.x = -Math.abs(this.playerSprite.scale.x); // make sprite face left
    }
  }

  setupKeyboardControls() {
    // 'this.keysDown.bind(this)', cannot be 'this.keysDown' as this is passed through as an event listener
    // this therefore loses the 'this' property therefore it won't be referencing the 'tankPlayer' object
    // this therefore causes 'this.playerX', and 'this.playerY' to be undefined 
    window.addEventListener("keydown", this.keysDown.bind(this));
    window.addEventListener("keyup", this.keysUp.bind(this));
  }

  keysDown(e) {
    if (e.keyCode == 68) {
      this.keys[e.keyCode] = true;
    } else if (e.keyCode == 65) {
      this.keys[e.keyCode] = true;
    } else if (e.keyCode == 32) {
      this.keys[e.keyCode] = true;
    }
  }

  keysUp(e) {
    if (e.keyCode == 68) {
      this.keys[e.keyCode] = false;
    } else if (e.keyCode == 65) {
      this.keys[e.keyCode] = false;
    } else if (e.keyCode == 32) {
      this.keys[e.keyCode] = false;
    }
  }
}
