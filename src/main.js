import { Application, Assets } from "pixi.js";
import { Slider } from "./core/slider.js";
import { TankPlayer } from "./core/player";
import { Ground } from "./core/ground";
import { Background } from "./scenes/mapImage.js";

(async () => {

    const app = new Application();
    await app.init({
        resizeTo: window
    });

    app.canvas.style.position = 'absolute';
    document.body.appendChild(app.canvas);
    const [appHeight, appWidth] = [app.renderer.height, app.renderer.width];

    // Adding ground
    const activeGround = new Ground(app)
    await activeGround.initialiseGround();
    app.stage.addChild(activeGround.getGround());

    // Adding background
    const background = new Background(appHeight - 150, appWidth);
    await background.initialiseBackground();
    //app.stage.addChild(background.getBackground());
  
    // Adding player
    const playerOneTexture = await Assets.load('assets/images/tank.png');
    const playerOne = new TankPlayer(appWidth / 10, appHeight - 300, app, playerOneTexture);
    await playerOne.initialisePlayerSprite();
    app.stage.addChild(playerOne.getSprite());
    playerOne.setupKeyboardControls();

    // Adding second player
    const playerTwoTexture = await Assets.load('assets/images/tank.png');
    const playerTwo = new TankPlayer(appWidth / 1.2, appHeight - 300, app, playerTwoTexture);
    await playerTwo.initialisePlayerSprite();
    app.stage.addChild(playerTwo.getSprite());
    playerTwo.setupKeyboardControls();


    // Adding projectile mechanism
    // TODO: Re-Add the Sliders once they are working
    const sliderLaunchAngle = new Slider(100, 200, app, 320, "Launch Angle");
    const sliderVelocity = new Slider(100, 100, app, 320, "Initial Velocity");
    //sliderLaunchAngle.addGraphicsToStage();
    //sliderVelocity.addGraphicsToStage();

    // Checking ground collision
    activeGround.isThereCollision(playerOne);
    activeGround.isThereCollision(playerTwo);
    let [isPlayerOneFalling, isPlayerTwoFalling] = [true, true];
    let playerTurn = true;
    let [playerOneMoveDist, playerTwoMoveDist] = [20, 20];

    // Gameloop
    app.ticker.add(() => {
        playerOne.updateBullets();
        playerTwo.updateBullets();
        if (playerOne.checkSpaceBarInput() && playerTurn) {
            playerOne.createBullet();
        } else if (playerTwo.checkSpaceBarInput() && !playerTurn) {
            playerTwo.createBullet();
        }

        // Ground collision and movement detection
        playerOne.updatePlayerPosition();
        playerTwo.updatePlayerPosition();
        activeGround.isThereCollision(playerOne);
        if (isPlayerOneFalling){
            playerOne.applyGravity();
        }
        activeGround.isThereCollision(playerTwo);
        if (isPlayerTwoFalling){
            playerTwo.applyGravity();
        }

        if (playerTurn){
            if (playerOne.moveDist > 0){
                playerOne.movePlayer();
            } else {
                playerTurn = false;
                playerTwo.resetMoveDist();
            }
        } else {
            if (playerTwo.moveDist > 0){
                playerTwo.movePlayer();
            } else {
                playerTurn = true;
                playerOne.resetMoveDist();
            }
        }
    })
})();
