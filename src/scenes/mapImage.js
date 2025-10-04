import { Sprite, Assets, Texture } from "pixi.js";

export class Background {
    constructor(app, appHeight, appWidth) {
      this.app = app;
      this.backgroundImage = null;
      this.appHeight = appHeight;
      this.appWidth = appWidth;
    }

    async initialiseBackground() {
      // const texture = await Assets.load("../assets/images/tank_squared_background.png");
      const texture = await Assets.load("../assets/images/backgroundPlains.jpg");
      this.backgroundImage = new Sprite(texture);
      //this.backgroundImage = new Sprite.from("../assets/images/tank_squared_background.png");
      // this.backgroundImage.height = this.appHeight;
      // this.backgroundImage.width = this.appWidth;
      this.app.stage.addChild(this.backgroundImage);
    }

    getBackground() {
      return this.backgroundImage;
    }
};

