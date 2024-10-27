import { Graphics } from "pixi.js";

export class Ground {
    constructor(app){
        this.app = app;
        this.ground = null;
    }
    async initialiseGround(){
        this.ground = new Graphics()
          .drawRect(0, this.app.renderer.height - 200, this.app.renderer.width, 200) // Draw ground with desired height
          .fill(0x654321);
    };

    getGround(){
        return this.ground;
    };
};
