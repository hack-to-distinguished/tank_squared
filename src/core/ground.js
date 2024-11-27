import { Graphics, GraphicsContext } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
        this.appHeight = this.app.renderer.height;
        this.appWidth = this.app.renderer.width;
    };

    async initialiseGround(){
        let groundShape = new Graphics()
            //.rect(0, this.appHeight - 70, this.appWidth, 200)
            .beginFill(0xffff00)
            .moveTo(0, this.appHeight - 200)
            .lineTo(100, this.appHeight - 200)
            .lineTo(200, this.appHeight - 100)
            .lineTo(300, this.appHeight - 100)
            //.lineTo(400, this.appHeight - 300)
            //.lineTo(this.appWidth, this.appHeight - 50)

            .endFill(0xffff00);
        this.ground = new Graphics(groundShape)
        //    .fill(0xffff00)
        // INFO: the background changes the colour of the ground
    };

    //async initialiseGround() {
    //    const groundGraphics = new Graphics();
    //
    //    groundGraphics.beginFill(0x654321); // Brown color for the ground
    //
    //    groundGraphics.moveTo(0, this.appHeight - 150);
    // INFO: Try using directly GroundShape like below with groundGraphics
    //    groundGraphics.lineTo(100, this.appHeight - 200); // First bump
    //    groundGraphics.lineTo(200, this.appHeight - 150); // Downhill
    //    groundGraphics.lineTo(300, this.appHeight - 170); // Small bump
    //    groundGraphics.lineTo(400, this.appHeight - 160); // Gentle rise
    //    groundGraphics.lineTo(500, this.appHeight - 180); // Second hill
    //    groundGraphics.lineTo(600, this.appHeight - 140); // Sharp descent
    //    groundGraphics.lineTo(700, this.appHeight - 150); // Plateau
    //    groundGraphics.lineTo(800, this.appHeight - 190); // Hill again
    //    groundGraphics.lineTo(900, this.appHeight - 150); // Back to flat
    //
    //    groundGraphics.lineTo(this.appWidth, this.appHeight);
    //    groundGraphics.lineTo(0, this.appHeight);
    //    groundGraphics.closePath();
    //
    //    groundGraphics.endFill();
    //
    //    this.ground = groundGraphics;
    //}

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
