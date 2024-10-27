import { Assets, Sprite, Application } from "pixi.js";

export class tankPlayer {
    constructor(playerX, playerY){
        // setup the x, y co-ordinates
        this.playerX = playerX;
        this.playerY = playerY;
    }

    async initialiseSprite(){
        // load texture of player, and convert into sprite.
        const texture = await Assets.load('assets/images/tank.png'); // 'await' keyword used for asynchronous texture loading
        const sprite = Sprite.from(texture);

        // resizing the texture
        sprite.height = 100;
        sprite.width = 225;

        // initialise x, y to arguements passed through via constructor
        sprite.x = this.playerX;
        sprite.y = this.playerY;
        this.sprite = sprite;
    }

    getSprite(){
        return this.sprite;
    }
}