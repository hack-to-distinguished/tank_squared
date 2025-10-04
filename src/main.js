import { Application, Assets } from "pixi.js";
import { TankPlayer } from "./core/player";
import { DebugRenderer } from "./core/debugOutlines.js";
import { World, Vec2 } from "planck";
import { MapGenerator } from "./core/terrainGeneration/mapGenerator.js";
import { Background } from "./scenes/mapImage.js";
import { createMainMenu } from './menu.js';

export async function startGame() {

    const app = new Application();
    await app.init({
        resizeTo: window
    });

    let world = new World({
        gravity: Vec2(0, -9.8),
    });

    const scaleFactor = 25;

    app.canvas.style.position = 'absolute';
    document.body.appendChild(app.canvas);
    const [appHeight, appWidth] = [app.renderer.height, app.renderer.width];


    const shellTexture = await Assets.load("assets/images/bullet.png");
    const playerTexture = await Assets.load('assets/images/tank.png');
  
    // INFO: Generate backgroundPlains
    const backgroundImg = new Background(app, appHeight, appWidth);
    console.log("Background image gen", Background);
    await backgroundImg.initialiseBackground();

    // INFO: Map Generator
    const mapGenerator = new MapGenerator(app);
    let terrainPoints = mapGenerator.generateTerrain(128, 256, 2, 2);
    mapGenerator.drawTerrain(terrainPoints, world, scaleFactor, app);


    // INFO: Player 1
    const playerOneX = appWidth / 10;
    const playerOneY = appHeight - mapGenerator.getHeightAt(playerOneX) + 50;
    const playerOne = new TankPlayer(playerOneX, playerOneY, app, playerTexture, scaleFactor, world, shellTexture);
    playerOne.name = "Player 1";
    await playerOne.initialisePlayerSprite();
    await playerOne.initialiseShellSprite();
    await playerOne.initialisePlayerHealthBar();
    playerOne.setupCollisionHandler();
    playerOne.playerBody.setUserData({ type: "tank", player: playerOne })


    // INFO: Player 2
    const playerTwoX = appWidth / 1.2;
    const playerTwoY = appHeight - mapGenerator.getHeightAt(playerTwoX) + 50;
    const playerTwo = new TankPlayer(playerTwoX, playerTwoY, app, playerTexture, scaleFactor, world, shellTexture);
    playerTwo.name = "Player 2";
    await playerTwo.initialisePlayerSprite();
    await playerTwo.initialiseShellSprite();
    await playerTwo.initialisePlayerHealthBar();
    playerTwo.setupCollisionHandler();
    playerTwo.playerBody.setUserData({ type: 'tank', player: playerTwo });

    playerOne.hideHPBar();
    playerTwo.hideHPBar();

    let currentPlayer = playerOne;
    let otherPlayer = playerTwo;
    let turnActive = true;

    const debugRenderer = new DebugRenderer(world, app, scaleFactor);

    let isPlayerTwoHit = false;
    let isPlayerOneHit = false;

    const hpBarHideCooldown = 5;

    const switchTurn = () => {
        // console.log("Switching turn...");
        currentPlayer.removeKeyboardControls();
        currentPlayer.resetPlayerMotorSpeed();
        currentPlayer.resetMoveDist();

        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
        otherPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;

        currentPlayer.setupKeyboardControls();
        currentPlayer.resetMoveDist();
        turnActive = true;
    }

    playerOne.on("fired", (eventData) => {
        if (currentPlayer === playerOne) {
            turnActive = false;
            currentPlayer.moveDist = 0;
        }
    });

    playerTwo.on("fired", (eventData) => {
        if (currentPlayer === playerTwo) {
            turnActive = false;
            currentPlayer.moveDist = 0;
        }
    });

    const handleShellSequenceEnd = (player) => {
        if (currentPlayer === player) {
            setTimeout(() => {
                if (!turnActive) {
                    switchTurn();
                }
            }, 1);
        }
    };

    playerOne.on("shellSequenceComplete", () => handleShellSequenceEnd(playerOne));
    playerTwo.on("shellSequenceComplete", () => handleShellSequenceEnd(playerTwo));

    playerOne.on("hit", () => {
        // console.log("Player 1 hit player 2");
        playerTwo.updatePlayerHealthBar();
        playerTwo.revealHPBar();
        playerTwo.hideHPBar();
    });

    playerTwo.on("hit", () => {
        // console.log("Player 2 hit player 1");
        playerOne.updatePlayerHealthBar();
        playerOne.revealHPBar();
        playerOne.hideHPBar();
    });

    playerOne.on("self-hit", () => {
        playerOne.updatePlayerHealthBar();
        playerOne.revealHPBar();
        playerOne.hideHPBar();
    })

    playerTwo.on("self-hit", () => {
        playerTwo.updatePlayerHealthBar();
        playerTwo.revealHPBar();
        playerTwo.hideHPBar();
    })

    currentPlayer.setupKeyboardControls();
    app.ticker.maxFPS = 60;
    app.ticker.add(() => {
        world.step(1 / 60);

        if (turnActive && currentPlayer) {
            currentPlayer.movePlayer();
        } else if (currentPlayer && !turnActive) {
            currentPlayer.resetPlayerMotorSpeed();
        }

        playerOne.updatePlayer();
        playerTwo.updatePlayer();

        playerOne.updateShell(mapGenerator);
        playerTwo.updateShell(mapGenerator);

        if (playerOne.shotOutOfBounds &&
            currentPlayer === playerOne && !turnActive) {
            playerOne.shotOutOfBounds = false;
            handleShellSequenceEnd(playerOne);
        }
        if (playerTwo.shotOutOfBounds &&
            currentPlayer === playerTwo && !turnActive) {
            playerTwo.shotOutOfBounds = false;
            handleShellSequenceEnd(playerTwo);
        }

        playerOne.updatePosPlayerHealthBar();
        playerTwo.updatePosPlayerHealthBar();

        playerOne.destroyShellOutsideContactEvent();
        playerTwo.destroyShellOutsideContactEvent();


        // debugRenderer.render();

    })
}

createMainMenu();
