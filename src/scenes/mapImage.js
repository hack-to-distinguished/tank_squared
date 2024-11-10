import { Sprite, Assets, Texture } from "pixi.js";

export class Background {
    constructor(appHeight, appWidth) {
        this.backgroundImage = null;
        this.appHeight = appHeight;
        this.appWidth = appWidth;
    }

    async initialiseBackground() {
        const texture = await Assets.load("../assets/images/tank_squared_background.png");
        this.backgroundImage = new Sprite(texture);
        //this.backgroundImage = new Sprite.from("../assets/images/tank_squared_background.png");
        this.backgroundImage.height = this.appHeight;
        this.backgroundImage.width = this.appWidth;
    }

    getBackground() {
        return this.backgroundImage;
    }
};

