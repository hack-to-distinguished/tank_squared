import { Sprite } from "pixi.js";
import { BulletProjectile } from "./bullet";
import { Vec2 } from "planck";

export class TankPlayer {
    constructor(playerX, playerY, app, playerTexture, coordConverter, world) {
        this.world = world;
        this.coordConverter = coordConverter;
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

    checkIfBulletIsPresent() {
        if (this.bullets.length == 1) {
            return true;
        } 
        return false;
    }

    async createBullet(velX, velY) {
        // create projectile rigid body in planck.js
        const projectileUserBody = this.world.createBody({
            position: Vec2(this.coordConverter.convertPixiXtoPlanckX(this.getX()), this.coordConverter.convertPixiYToPlanckY(this.app, this.getY())),
            type: 'dynamic'
        })
        projectileUserBody.setLinearVelocity(Vec2(velX, velY));

        // create the projecilte 
        const bulletProjectile = new BulletProjectile(this.coordConverter.convertPlanckXtoPixiX(projectileUserBody.getPosition().x), this.coordConverter.convertPlanckYToPixiY(this.app, projectileUserBody.getPosition().y), this.app, projectileUserBody);
        await bulletProjectile.initialiseBulletSprite();
        this.app.stage.addChild(bulletProjectile.getSprite());

        this.bullets.push(bulletProjectile);
    }

    updateBullets() {
        if (this.checkIfBulletIsPresent()) {
            const bulletProjectile = this.bullets[0];
            const projectileUserBody = bulletProjectile.getProjectileUserBody();

            // checks if the bullet's y position (on the cartesian planck.js coord sys) has gone below zero
            // and empties arr as required.
            // if it goes below zero, it is basically the same as saying it has gone below the bottom screen border
            if (projectileUserBody.getPosition().y < 0) {
                this.world.destroyBody(projectileUserBody);
                this.bullets.splice(0, 1);
            }

            if (projectileUserBody.getPosition().y > 0) {
                // allowing the world to run the physics simulation, if the projectile is within the screen
                this.world.step(1/60);

                let pixiX = this.coordConverter.convertPlanckXtoPixiX(projectileUserBody.getPosition().x);
                let pixiY = this.coordConverter.convertPlanckYToPixiY(this.app, projectileUserBody.getPosition().y);
                bulletProjectile.updateBullet(pixiX, pixiY);
            } 
        }
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
