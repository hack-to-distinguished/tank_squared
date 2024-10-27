import { Assets, Sprite } from "pixi.js";

export class bulletProjectile {
    constructor(bulletX, bulletY) {
        this.bulletX = bulletX;
        this.bulletY = bulletY;
    }

    async initialiseBulletSprite() {
        const texture = await Assets.load('assets/images/bullet.png');
        const sprite = Sprite.from(texture);
        sprite.x = this.bulletX;
        sprite.y = this.bulletY;
        this.sprite = sprite;
    }

    addToStage(app) {
        app.stage.addChild(this.sprite);
    }
}