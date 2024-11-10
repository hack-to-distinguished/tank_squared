import { Application, Assets, Text, Graphics, Sprite, SCALE_MODES } from "pixi.js";
import { Slider } from "./core/slider.js";
import { TankPlayer } from "./core/player";
import { Ground } from "./core/ground";
import { Background } from "./scenes/mapImage.js";
import { TrajectoryCalculator } from "./core/trajectoryCalculator.js";

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
    app.stage.addChild(background.getBackground());
  
    // Adding player
    let [playerOneX, playerOneY] = [400, appHeight - 300];
    const playerOne = new TankPlayer(playerOneX, playerOneY, app);
    await playerOne.initialisePlayerSprite();
    app.stage.addChild(playerOne.getSprite());
    playerOne.setupKeyboardControls();

    // Adding projectile mechanism
    const sliderLaunchAngle = new Slider(100, 200, app, 320, "Launch Angle");
    sliderLaunchAngle.addGraphicsToStage();

    const sliderVelocity = new Slider(100, 100, app, 320, "Initial Velocity");
    sliderVelocity.addGraphicsToStage();

    // Checking ground collision
    await activeGround.isThereCollision(playerOne);
    let isFalling = true;

    // Create ticker in order to update sprite positioning
    app.ticker.add(() => {
        playerOne.updatePlayerPosition();
        playerOne.updateBullets();
        if (playerOne.checkSpaceBarInput()) {
            playerOne.createBullet();
        }

        let isColliding = activeGround.isThereCollision(playerOne);
        if (isColliding){
            isFalling = false;
        };

        if (isFalling){
            playerOne.applyGravity();
        };
    })
})();
