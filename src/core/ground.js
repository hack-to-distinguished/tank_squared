import { Graphics } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
    }
    async initialiseGround(){
        this.ground = new Graphics()
            .rect(0, this.app.renderer.height - 200, this.app.renderer.width, 200)
            .fill(0x654321);
    }

    getGround(){
        return this.ground;
    }

    // For now this only gets the flat ground. We might have to calculate the ground at every point if we want to add hills etc
    getGroundSurface(){
        // TODO: Find a better way of getting ground lvl - Needs to work with hills
        return this.ground.getBounds().minY;
    }

    // Check if anything is lower than ground and if so move it just about it
    isThereCollision(collidingSprite){
        const surface = this.getGroundSurface()
        const yPosition = collidingSprite.playerY + 50;
        if (yPosition > surface){
            collidingSprite.playerY = surface - 50
            return true;
        }
    }
};
