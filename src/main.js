import { Application, Assets, Graphics } from "pixi.js";
import { Slider } from "./core/slider.js";
import { TankPlayer } from "./core/player";
import { Ground } from "./core/ground.js";
import { Background } from "./scenes/mapImage.js";
import { DebugRenderer } from "./core/debugOutlines.js";
import { World, Vec2 } from "planck";
import { coordConverter } from "./core/coordConverter.js";
import { MapGenerator } from "./core/terrainGeneration/mapGenerator.js";

(async () => {

    const app = new Application();
    await app.init({
        resizeTo: window
    });

    let world = new World({
        gravity: Vec2(0, -9.8),
    });

    const sf = 25;

    app.canvas.style.position = 'absolute';
    document.body.appendChild(app.canvas);
    const [appHeight, appWidth] = [app.renderer.height, app.renderer.width];

    // Adding background
    // const background = new Background(appHeight - 150, appWidth);
    // await background.initialiseBackground();
    //app.stage.addChild(background.getBackground());

    let converter = new coordConverter(250);

    // Adding player
    const shellTexture = await Assets.load("assets/images/bullet.png");
    const playerOneTexture = await Assets.load('assets/images/tank.png');
    const playerOne = new TankPlayer(appWidth / 10, appHeight - 300, app, playerOneTexture, sf, converter, world, shellTexture);
    await playerOne.initialisePlayerSprite();
    await playerOne.initialiseShellSprite();
    playerOne.setupKeyboardControls();

    // Adding second player
    const playerTwoTexture = await Assets.load('assets/images/tank.png');
    const playerTwo = new TankPlayer(appWidth / 1.2, appHeight - 300, app, playerTwoTexture, sf, converter, world, shellTexture);
    await playerTwo.initialisePlayerSprite();
    await playerTwo.initialiseShellSprite();
    playerTwo.setupKeyboardControls();

    // Adding projectile mechanism
    const sliderLaunchAngle = new Slider(100, 200, app, 320, "Launch Angle");
    const sliderVelocity = new Slider(100, 100, app, 320, "Initial Velocity");
    sliderLaunchAngle.addGraphicsToStage();
    sliderVelocity.addGraphicsToStage();

    let magnitudeVelocity = 0;
    let launchAngle = 0;

    let [isPlayerOneFalling, isPlayerTwoFalling] = [true, true];
    let playerTurn = true;
    let [playerOneMoveDist, playerTwoMoveDist] = [20, 20];

    app.ticker.maxFPS = 60;
    const debugRenderer = new DebugRenderer(world, app, sf);

    // adding mapgenerator
    const mapGenerator = new MapGenerator(app);
    const terrain = mapGenerator.generateTerrain(app, 128, 256, 1, 2);
    mapGenerator.drawTerrain(app, terrain, world, sf);

    const fireCooldown = 1000;
    let lastFireTime = 0;
    let shellVisible = false;

    app.ticker.add(() => {

        // takes values from the sliders, and calculates the vertical, and horizontal motion
        if (sliderLaunchAngle.getNormalisedSliderValue() == 0) {
            launchAngle = converter.convertDegreesToRadians(90);
        } else {
            launchAngle = converter.convertDegreesToRadians(sliderLaunchAngle.getNormalisedSliderValue() * 180);
        }
        if (sliderVelocity.getNormalisedSliderValue() == 0) {
            magnitudeVelocity = 5;
        } else {
            magnitudeVelocity = sliderVelocity.getNormalisedSliderValue() * 10;
        }

        const velX = magnitudeVelocity * Math.cos(launchAngle);
        const velY = magnitudeVelocity * Math.sin(launchAngle);

        world.step(1 / 60);
        const currentTime = Date.now();
        if (playerTurn) {
            if (playerOne.checkSpaceBarInput() && currentTime - lastFireTime >= fireCooldown) {
                playerOne.openFire(velX, velY);
                shellVisible = true;
                lastFireTime = currentTime;
                playerTurn = false
                playerTwo.resetMoveDist();
            } else {
                if (playerOne.moveDist > 0) {
                    playerOne.movePlayer()
                } else {
                    playerTurn = false;
                    playerTwo.resetMoveDist();
                }
            }
        } else {
            if (playerTwo.checkSpaceBarInput() && currentTime - lastFireTime >= fireCooldown) {
                playerTwo.openFire(velX, velY);
                shellVisible = true;
                lastFireTime = currentTime;
                playerTurn = true;
                playerOne.resetMoveDist();
            } else {
                if (playerTwo.moveDist > 0) {
                    playerTwo.movePlayer();
                } else {
                    playerTurn = true;
                    playerOne.resetMoveDist();
                }
            }
        }

        // TODO: While visible, run the action
        if (shellVisible) {
            const shellActive = playerOne.updateShell() || playerTwo.updateShell();
            // TODO: Change from a visible flag to a collided with flag
            if (shellActive == 0) {
                shellVisible = false;
            }
            console.log("shell still active", shellActive);
        }

        playerOne.updatePlayer();
        playerTwo.updatePlayer();
        //debugRenderer.render();
    })
})();
