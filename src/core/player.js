import { Assets, Sprite, Application } from "pixi.js";

export class tankPlayer {
    constructor(playerX, playerY){
        // setup the x, y co-ordinates
        this.playerX = playerX;
        this.playerY = playerY;
        this.playerSpeed = 10;
        this.sprite = null;
        console.log("Created tank!")
        console.log(this.playerX);
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

    addToStage(app) {
        app.stage.addChild(this.sprite);
    }

    getSprite(){
        return this.sprite;
    }

    updatePlayerPosition(){
        console.log("Updating sprite position");
        // this.sprite.x = this.playerX;
        // this.sprite.y = this.playerY;
        this.sprite.x = this.playerX;
    }

    setupKeyboardControls() {
        window.addEventListener("keydown", this.keysDown);
    }

    keysDown(e) {
        if (e.keyCode == 68) {
            this.playerX += this.playerSpeed;
            // console.log("Key was pressed");
            console.log(e.keyCode);
            console.log(this.playerX);
        }
    }
}