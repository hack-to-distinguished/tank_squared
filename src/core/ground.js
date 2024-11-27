import { Graphics, GraphicsContext } from "pixi.js";

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

            .moveTo(0, this.appHeight - 150)
            .lineTo(100, this.appHeight - 200)
            .lineTo(200, this.appHeight - 150)
            .lineTo(300, this.appHeight - 170)
            .lineTo(400, this.appHeight - 160)
            .lineTo(500, this.appHeight - 180)
            .lineTo(600, this.appHeight - 140)
            .lineTo(700, this.appHeight - 150)
            .lineTo(800, this.appHeight - 190)
            .lineTo(900, this.appHeight - 150)

            .lineTo(this.appWidth, this.appHeight)
            .lineTo(0, this.appHeight)
            .closePath()

            .endFill()

        this.ground = groundGraphics;
    }

    getGround(){
        console.log("Returned Ground", this.ground);
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
