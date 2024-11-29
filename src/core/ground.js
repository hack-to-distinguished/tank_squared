import { Graphics } from "pixi.js";

export class Ground {
    constructor(app, world){
        this.app = app;
        this.ground = null;
        this.appHeight = this.app.renderer.height;
        this.appWidth = this.app.renderer.width;
        this.groundPoints = [];
        this.world = world;
    };
    /*
    Ground must be a shape
    */

    async initialiseGround() {
        // Define the ground shape with points
        //this.groundPoints = [
        //    { x: 0, y: this.appHeight - 200 },
        //    { x: this.appWidth / 20, y: this.appHeight - 180 },
        //    { x: this.appWidth / 7, y: this.appHeight - 180 },
        //    { x: this.appWidth / 4.5, y: this.appHeight - 170 },
        //    { x: this.appWidth / 3.5, y: this.appHeight - 250 },
        //    { x: this.appWidth / 3.1, y: this.appHeight - 250 },
        //    { x: this.appWidth / 2.75, y: this.appHeight - 180 },
        //    { x: this.appWidth / 2.3, y: this.appHeight - 140 },
        //    { x: this.appWidth / 1.95, y: this.appHeight - 150 },
        //    { x: this.appWidth / 1.73, y: this.appHeight - 190 },
        //    { x: this.appWidth / 1.54, y: this.appHeight - 250 },
        //    { x: this.appWidth / 1.45, y: this.appHeight - 250 },
        //    { x: this.appWidth / 1.32, y: this.appHeight - 150 },
        //    { x: this.appWidth / 1.18, y: this.appHeight - 140 },
        //    { x: this.appWidth / 1.06, y: this.appHeight - 110 },
        //    { x: this.appWidth, y: this.appHeight - 250 }
        //];
        //
        //const groundGraphics = new Graphics()
        //    .beginFill(0x654321)
        //    .moveTo(this.groundPoints[0].x, this.groundPoints[0].y);
        //
        //for (let i = 1; i < this.groundPoints.length; i++) {
        //    groundGraphics.lineTo(this.groundPoints[i].x, this.groundPoints[i].y);
        //}
        //
        //groundGraphics
        //    .lineTo(this.appWidth, this.appHeight)
        //    .lineTo(0, this.appHeight)
        //    .closePath()
        //    .endFill();
        //
        //this.ground = groundGraphics;
        this.world.createBody({
            type: 'static'
        })
    }

    getGround(){
        this.ground = new Graphics()
            .lineTo(this.appWidth, this.appHeight)
        return this.ground;
    };

    ///**
    // * Interpolates to find the ground height at a specific x position.
    // * @param {number} x The x-coordinate to check.
    // * @returns {number} The interpolated y-coordinate (ground height) at x.
    // */
    //getGroundHeightAtX(x) {
    //    // Ensure x is within bounds
    //    if (x <= this.groundPoints[0].x) {
    //        return this.groundPoints[0].y;
    //    }
    //    if (x >= this.groundPoints[this.groundPoints.length - 1].x) {
    //        return this.groundPoints[this.groundPoints.length - 1].y;
    //    }
    //
    //    // Find the two points the x is between
    //    for (let i = 0; i < this.groundPoints.length - 1; i++) {
    //        const p1 = this.groundPoints[i];
    //        const p2 = this.groundPoints[i + 1];
    //
    //        if (x >= p1.x && x <= p2.x) {
    //            // Linear interpolation formula
    //            const t = (x - p1.x) / (p2.x - p1.x); // Normalized distance between p1 and p2
    //            return p1.y + t * (p2.y - p1.y);
    //        }
    //    }
    //    // Default fallback
    //    return this.appHeight;
    //}

    isThereCollision(collidingSprite) {
        //const groundHeightAtSprite = this.getGroundHeightAtX(collidingSprite.playerX);
        const groundHeightAtSprite = 500;
        const spriteBottomY = collidingSprite.playerY + 50;

        if (spriteBottomY > groundHeightAtSprite) {
            collidingSprite.playerY = groundHeightAtSprite - 50;
        }
    }
}
