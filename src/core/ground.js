import { Graphics } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
        this.appHeight = this.app.renderer.height;
        this.appWidth = this.app.renderer.width;
    };

    async initialiseGround() {
        const groundGraphics = new Graphics()
            .beginFill(0x654321)

            .moveTo(0, this.appHeight - 200)
            .lineTo(this.appWidth/20, this.appHeight - 180)
            .lineTo(this.appWidth/7, this.appHeight -180)
            .lineTo(this.appWidth/4.5, this.appHeight - 170)
            .lineTo(this.appWidth/3.5, this.appHeight - 250)
            .lineTo(this.appWidth/3.1, this.appHeight - 250)
            .lineTo(this.appWidth/2.75, this.appHeight - 180)
            .lineTo(this.appWidth/2.3, this.appHeight - 140)
            .lineTo(this.appWidth/1.95, this.appHeight - 150)
            .lineTo(this.appWidth/1.73, this.appHeight - 190)
            .lineTo(this.appWidth/1.54, this.appHeight - 250)
            .lineTo(this.appWidth/1.45, this.appHeight - 250)
            .lineTo(this.appWidth/1.32, this.appHeight - 150)
            .lineTo(this.appWidth/1.18, this.appHeight - 140)
            .lineTo(this.appWidth/1.06, this.appHeight - 110)
            .lineTo(this.appWidth, this.appHeight - 250)
            
            .lineTo(this.appWidth, this.appHeight)
            .lineTo(0, this.appHeight)
            .closePath()
            .endFill()

        this.ground = groundGraphics;
    }

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
