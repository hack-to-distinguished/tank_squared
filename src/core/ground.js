import { Graphics } from "pixi.js";
import { World, Circle, Vec2, Edge } from "planck";

export class Ground {
    constructor(app, world){
        this.app = app;
        this.groundGraphics = new Graphics();
        this.appHeight = this.app.renderer.height;
        this.appWidth = this.app.renderer.width;
        this.world = world;
    };

    async initialiseGround() {
        const scale = 30;
        const screenWidth = this.appWidth / scale;

        var ground = this.world.createBody({
            type: 'static',
            position: new Vec2(0.0, -10.0),
        });

        ground.createFixture({
            shape: new Edge(new Vec2(-screenWidth / 2, 0), new Vec2(screenWidth / 2, 0)),
            density: 0, 
            friction: 0.6
        });

        this.groundGraphics.rect(
            -(this.appWidth / 2), // Center horizontally
            100, // Height above the baseline
            this.appWidth, // Full screen width
            10 // Thickness
        );
        this.groundGraphics.fill(0xFFFFFF);

        this.groundGraphics.x = this.appWidth / 2; 
        this.groundGraphics.y = this.appHeight - (10 * scale);

        this.app.stage.addChild(this.groundGraphics);
    }

    getGround(){
        return this.groundGraphics;
    }

    isThereCollision(collidingSprite) {
        //const groundHeightAtSprite = this.getGroundHeightAtX(collidingSprite.playerX);
        const groundHeightAtSprite = 500;
        const spriteBottomY = collidingSprite.playerY + 50;

        if (spriteBottomY > groundHeightAtSprite) {
            collidingSprite.playerY = groundHeightAtSprite - 50;
        }
    }
}
