<<<<<<< Updated upstream
import { Application, Assets, Sprite } from "pixi.js";
import { TankPlayer } from "./core/player";
import { DebugRenderer } from "./core/debugOutlines.js";
import { World, Vec2 } from "planck";
import { MapGenerator } from "./core/terrainGeneration/mapGenerator.js";
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

    // INFO: Player 1
    const playerOne = new TankPlayer(appWidth / 10, appHeight - 550, app, playerTexture, scaleFactor, world, shellTexture);
    playerOne.name = "Player 1";
    await playerOne.initialisePlayerSprite();
    await playerOne.initialiseShellSprite();
    await playerOne.initialisePlayerHealthBar();
    playerOne.playerBody.setUserData({ type: "tank", player: playerOne})


    // INFO: Player 2
    const playerTwo = new TankPlayer(appWidth / 1.2, appHeight - 550, app, playerTexture, scaleFactor, world, shellTexture);
    playerTwo.name = "Player 2";
    await playerTwo.initialisePlayerSprite();
    await playerTwo.initialiseShellSprite();
    await playerTwo.initialisePlayerHealthBar();
    playerTwo.playerBody.setUserData({ type: 'tank', player: playerTwo });


    let currentPlayer = playerOne;
    let otherPlayer = playerTwo;
    let turnActive = true;

    const debugRenderer = new DebugRenderer(world, app, scaleFactor);

    // INFO: Map Generator
    const mapGenerator = new MapGenerator(app);
    let terrainPoints = mapGenerator.generateTerrain(128, 256, 2, 2);
    mapGenerator.drawTerrain(terrainPoints, world, scaleFactor, app);

    let isPlayerTwoHit = false;
    let isPlayerOneHit = false;

    const hpBarHideCooldown = 5;

    const switchTurn = () => {
        console.log("Switching turn...");
        currentPlayer.removeKeyboardControls();
        currentPlayer.resetPlayerMotorSpeed();
        currentPlayer.resetMoveDist();

        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
        otherPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;

        currentPlayer.setupKeyboardControls();
        currentPlayer.resetMoveDist();
        turnActive = true;
        console.log(`It is now ${currentPlayer.name}'s turn.`);

        playerOne.revealHPBar();
        playerTwo.revealHPBar();
    }

    playerOne.on("fired", (eventData) => {
        if (currentPlayer === playerOne) {
            console.log(`${eventData.player.name} fired detected in main`);
            turnActive = false;
            currentPlayer.moveDist = 0;
        }
    });
    playerTwo.on("fired", (eventData) => {
        if (currentPlayer === playerTwo) {
            console.log(`${eventData.player.name} fired detected in main`);
            turnActive = false;
            currentPlayer.moveDist = 0;
        }
    });

    const handleShellSequenceEnd = (player) => {
        if (currentPlayer === player) {
            console.log(`${player.name}'s shell sequence ended.`);
            setTimeout(() => {
                if (!turnActive) {
                    switchTurn();
                }
            }, 500);
        }
    };
    playerOne.on("shellSequenceComplete", () => handleShellSequenceEnd(playerOne));
    playerTwo.on("shellSequenceComplete", () => handleShellSequenceEnd(playerTwo));

    playerOne.on("hit", () => {
        console.log("Player 1 hit player 2");
        playerTwo.updatePlayerHealthBar(25);
        playerTwo.revealHPBar();
    });

    playerTwo.on("hit", () => {
        console.log("Player 2 hit player 1");
        playerOne.updatePlayerHealthBar(25);
        playerOne.revealHPBar();
    });


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

        playerOne.updateShell(mapGenerator, isPlayerOneHit);
        playerTwo.updateShell(mapGenerator, isPlayerTwoHit);

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

        if (isPlayerOneHit) {
            playerOne.revealHPBar();
        } else if (isPlayerTwoHit) {
            playerTwo.revealHPBar();
        }

        let time = performance.now();
        time /= 1000;
        time = Math.floor(time % 60);
        if (time % hpBarHideCooldown == 0 && time > 0) {
            playerOne.hideHPBar();
            playerTwo.hideHPBar();
        }

        isPlayerOneHit = false;
        isPlayerTwoHit = false;

        debugRenderer.render();

    })
}


createMainMenu();
