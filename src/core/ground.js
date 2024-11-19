import { Graphics, GraphicsContext } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
        this.appHeight = this.app.renderer.height;
        this.appWidth = this.app.renderer.width;
    };

    async initialiseGround(){
        //let flatGround = new GraphicsContext()
        //    .rect(0, this.appHeight - 200, this.appWidth, 200)
        //    .fill(0x654321);
        let bump = new GraphicsContext()
            .rect(0, this.appHeight - 200, this.appWidth, 200)
            .regularPoly(100, this.appHeight - 190, 20, 3, 0)
            .regularPoly(this.appWidth/2, this.appHeight - 160, 20, 3, 0)
            .fill(0x654321);
        //let completeGround = [flatGround, bump]
        this.ground = new Graphics(bump);
    };

    getGround(){
        return this.ground;
    };

    // For now this only gets the flat ground. We might have to calculate the ground at every point if we want to add hills etc
    getGroundSurface(){
        // TODO: Find a better way of getting ground lvl - Needs to work with hills
        return this.ground.getBounds().minY;
    };

    // Check if anything is lower than ground and if so move it just about it
    isThereCollision(collidingSprite){
        const surface = this.getGroundSurface()
        const yPosition = collidingSprite.playerY + 50;
        if (yPosition > surface){
            collidingSprite.playerY = surface - 50
        };
    };
};
