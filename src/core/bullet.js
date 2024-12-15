import { Sprite, Assets } from "pixi.js";
// refactor this, will need to combine both pixijs spirte plus body from planckjs

export class BulletProjectile {
    constructor(bulletX, bulletY, app, projectileUserBody) {
        this.projectileUserBody = projectileUserBody;
        this.bulletX = bulletX;
        this.bulletY = bulletY;
        this.app = app;

        // when sliders are implemented, these values should be manipulated roughly 
        this.bulletSpeedX = 100;
        this.bulletSpeedY = 50;
        this.gravity = 5;
    }

    getProjectileUserBody() {
        return this.projectileUserBody;
    }

    getX() {
        return this.bulletX;
    }

    getY() {
        return this.bulletY;
    }

    async initialiseBulletSprite() {
        // load texture of player, and convert into sprite.
        const bulletTexture = await Assets.load('assets/images/bullet.png');
        const bulletSprite = Sprite.from(bulletTexture);
        bulletSprite.anchor.set(0.5, 0.5); // set anchor point to centre of the sprite

        // initialise x, y to arguements passed through via constructor
        bulletSprite.x = this.bulletX;
        bulletSprite.y = this.bulletY;
        bulletSprite.width = 30;
        bulletSprite.height = 30;
        this.bulletSprite = bulletSprite;
    }

    getSprite() {
        if (this.bulletSprite) {
            return this.bulletSprite;
        }
    }

    updateBullet(newBulletX, newBulletY) {
        this.bulletSprite.x = newBulletX;
        this.bulletSprite.y = newBulletY;
    }
    
}
