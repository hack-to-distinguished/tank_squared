import { Application, Assets, Text, Graphics, Sprite, SCALE_MODES } from 'pixi.js';
import { Slider } from './core/slider.js';
import { TankPlayer } from "./core/player";
import { Ground } from "./core/ground";
//import { Background } from "./scenes/mapImage.js";
import { TrajectoryCalculator } from './core/trajectoryCalculator.js';

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
    //const background = new Background(appHeight - 150, appWidth);
    //await background.initialiseBackground();
    //app.stage.addChild(background.getBackground());
  
    // Adding player
    let [playerOneX, playerOneY] = [400, appHeight - 300];
    const playerOne = new tankPlayer(playerOneX, playerOneY);
    await playerOne.initialiseSprite();
    playerOne.addToStage(app);
    playerOne.setupKeyboardControls();

    // Adding projectile mechanism
    const sliderLaunchAngle = new slider(100, 200, app, 320, "Launch Angle");
    sliderLaunchAngle.addGraphicsToStage();

    const sliderVelocity = new slider(100, 100, app, 320, "Initial Velocity");
    sliderVelocity.addGraphicsToStage();

    // Create ticker in order to update sprite positioning
    app.ticker.add(() => {
        playerOne.updatePlayerPosition();
        playerOne.updateBullets();
        if (playerOne.checkSpaceBarInput()) {
            playerOne.createBullet();
        }
    })

    // Checking ground collision
    await activeGround.isThereCollision(playerOne);
    let isFalling = true;

    gameloop();
    function gameloop(timeStamp) {

        let isColliding = activeGround.isThereCollision(playerOne);
        if (isColliding){
            isFalling = false;
        };

        if (isFalling){
            playerOne.applyGravity();
        };
        requestAnimationFrame(gameloop);
    };
})();
