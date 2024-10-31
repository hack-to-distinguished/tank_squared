import { Sprite, Assets } from "pixi.js";

export class Background {
    constructor() {
        this.backgroundImage = null;
    }

    async initialiseBackground() {
        const texture = await Assets.load("../assets/images/tank_squared_background.png");
        this.backgroundImage = new Sprite(texture);
    }

    getBackground() {
        return this.backgroundImage;
    }
}

