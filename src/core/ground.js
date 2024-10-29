import { Graphics } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
    }
    async initialiseGround(){
        this.ground = new Graphics()
          .rect(0, this.app.renderer.height - 200, this.app.renderer.width, 200) // Draw ground with desired height
          .fill(0x654321);
    }

    getGround(){
        return this.ground;
    };

    // For now this only gets the flat ground. We might have to calculate the 
    // ground at every point if we want to add hills etc
    getGroundSurface(){
        console.log("GROUND LVL", this.ground.getBounds());
        return this.ground.getBounds().maxY;
    };

    // Check if anything is lower than ground and if so move it just about it
    isThereCollision(collidingSprite){
        // TODO: Find an alternative way of getting the bounds because relying on the x and y set by us won't work. We need something regular
        console.log("COLLIDING ELE", collidingSprite);
        const surface = this.getGroundSurface()
        const yPosition = collidingSprite.sprite.bounds.minY;
        console.log("objectBounds:", yPosition);
        console.log("SURFACE", surface);
        if (yPosition < surface){
            collidingSprite.sprite.bounds = surface + 1
        };
    };
};
