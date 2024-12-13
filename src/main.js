import { Application, Assets } from "pixi.js";
import { Slider } from "./core/slider.js";
import { TankPlayer } from "./core/player";
import { Ground } from "./core/ground";
import { Background } from "./scenes/mapImage.js";
import { World, Vec2 } from "planck";
import { coordConverter } from "./core/coordConverter.js";

(async () => {

    // creating the 'world' object to do physics calculations
    let world = new World({
        gravity: Vec2(0, -9.8),
    });

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

    let converter = new coordConverter(250); 
  
    // Adding player
    const playerOneTexture = await Assets.load('assets/images/tank.png');
    const playerOne = new TankPlayer(appWidth / 10, appHeight - 300, app, playerOneTexture, converter, world); 
    await playerOne.initialisePlayerSprite();
    app.stage.addChild(playerOne.getSprite());
    playerOne.setupKeyboardControls();

    // Adding second player
    const playerTwoTexture = await Assets.load('assets/images/tank.png');
    const playerTwo = new TankPlayer(appWidth / 1.2, appHeight - 300, app, playerTwoTexture, converter, world);
    await playerTwo.initialisePlayerSprite();
    app.stage.addChild(playerTwo.getSprite());
    playerTwo.setupKeyboardControls();


    // Adding projectile mechanism
    const sliderLaunchAngle = new Slider(100, 200, app, 320, "Launch Angle");
    const sliderVelocity = new Slider(100, 100, app, 320, "Initial Velocity");
    sliderLaunchAngle.addGraphicsToStage();
    sliderVelocity.addGraphicsToStage();

    // Checking ground collision
    activeGround.isThereCollision(playerOne);
    activeGround.isThereCollision(playerTwo);
    let [isPlayerOneFalling, isPlayerTwoFalling] = [true, true];
    let playerTurn = true;
    let [playerOneMoveDist, playerTwoMoveDist] = [20, 20];

    app.ticker.maxFPS = 60;

    // Gameloop
    app.ticker.add(() => {
        // takes values from the sliders, and calculates the vertical, and horizontal motion
        const launchAngle = converter.convertDegreesToRadians(sliderLaunchAngle.getNormalisedSliderValue() * 180);
        const magnitudeVelocity = sliderVelocity.getNormalisedSliderValue() * 10;
        const velX = magnitudeVelocity * Math.cos(launchAngle);
        const velY = magnitudeVelocity * Math.sin(launchAngle);
        console.log("\n Angle (degrees): ", sliderLaunchAngle.getNormalisedSliderValue() * 180);
        console.log("Magnitude Velocity (ms^(-1)): ", magnitudeVelocity);
        console.log("Velx: ", velX);
        console.log("VelY: ", velY);

        playerOne.updateBullets();
        playerTwo.updateBullets();
        if (playerOne.checkSpaceBarInput() && playerTurn && !(playerTwo.checkIfBulletIsPresent())) {
            console.log("Player One has shot!");
            playerOne.createBullet(velX, velY);
            playerTurn = false;

        } else if (playerTwo.checkSpaceBarInput() && !playerTurn && !(playerOne.checkIfBulletIsPresent())) {
            console.log("Player Two has shot!");
            playerTwo.createBullet(velX, velY);
            playerTurn = true;
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
