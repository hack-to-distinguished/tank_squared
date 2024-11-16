import { Assets, Sprite } from "pixi.js";
import { BulletProjectile } from "./bullet";

export class TankPlayer {
    constructor(playerX, playerY, app, playerTexture) {
        this.app = app;
        this.playerX = playerX;
        this.playerY = playerY;
        this.playerSpeed = 5;
        this.keys = {};
        this.bullets = [];
        this.moveDist = 30;
        this.playerTexture = playerTexture;
    }

    getX() {
        return this.playerX;
    }

    getY() {
        return this.playerY;
    }

    async createBullet() {
        const bullet = new BulletProjectile(this.playerX, this.playerY, this.app);
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
        const playerSprite = Sprite.from(this.playerTexture);
        playerSprite.anchor.set(0.5, 0.5);

        const desiredWidth = 150;
        const desiredHeight = 105;
        playerSprite.scale.set(desiredWidth / this.playerTexture.width, desiredHeight / this.playerTexture.height); 

        playerSprite.x = this.playerX;
        playerSprite.y = this.playerY;
        this.playerSprite = playerSprite;
    }

    getSprite() {
        if (this.playerSprite) {
            return this.playerSprite;
        }
    }

    applyGravity() {
        this.playerY += 3;
    }

    checkSpaceBarInput() {
        return this.keys['32'] === true;
    }

    updatePlayerPosition(){
        this.playerSprite.x = this.playerX;
        this.playerSprite.y = this.playerY;
    }

    movePlayer() {
        if (this.moveDist > 0){
            if (this.keys['68']) {
                this.playerX += this.playerSpeed;
                this.playerSprite.scale.x = Math.abs(this.playerSprite.scale.x);
                this.moveDist -= 1;
            } else if (this.keys['65']) {
                this.playerX -= this.playerSpeed;
                this.playerSprite.scale.x = -Math.abs(this.playerSprite.scale.x);
                this.moveDist -= 1;
            }
        }
    }

    resetMoveDist(){
        this.moveDist = 30;
    }

    setupKeyboardControls() {
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
};
