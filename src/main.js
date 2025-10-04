import { Application, Assets } from "pixi.js";
import { TankPlayer } from "./core/player";
import { DebugRenderer } from "./core/debugOutlines.js";
import { World, Vec2 } from "planck";
import { MapGenerator } from "./core/terrainGeneration/mapGenerator.js";
import { Background } from "./scenes/mapImage.js";
import { createMainMenu } from "./menu.js";
import { gameScreenManager } from "./screens/pauseAndDeathScreen.js";
import "./screens/pauseAndDeathScreen.css";

export async function startGame() {
  const app = new Application();
  await app.init({
    resizeTo: window,
  });

  let world = new World({
    gravity: Vec2(0, -9.8),
  });

  const scaleFactor = 25;

  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);
  const [appHeight, appWidth] = [app.renderer.height, app.renderer.width];

  const shellTexture = await Assets.load("assets/images/bullet.png");
  const playerTexture = await Assets.load("assets/images/tank.png");

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
  const playerOne = new TankPlayer(
    playerOneX,
    playerOneY,
    app,
    playerTexture,
    scaleFactor,
    world,
    shellTexture,
  );
  playerOne.name = "Player 1";
  await playerOne.initialisePlayerSprite();
  await playerOne.initialiseShellSprite();
  await playerOne.initialisePlayerHealthBar();
  playerOne.setupCollisionHandler();
  playerOne.playerBody.setUserData({ type: "tank", player: playerOne });

  // INFO: Player 2
  const playerTwoX = appWidth / 1.2;
  const playerTwoY = appHeight - mapGenerator.getHeightAt(playerTwoX) + 50;
  const playerTwo = new TankPlayer(
    playerTwoX,
    playerTwoY,
    app,
    playerTexture,
    scaleFactor,
    world,
    shellTexture,
  );
  playerTwo.name = "Player 2";
  await playerTwo.initialisePlayerSprite();
  await playerTwo.initialiseShellSprite();
  await playerTwo.initialisePlayerHealthBar();
  playerTwo.setupCollisionHandler();
  playerTwo.playerBody.setUserData({ type: "tank", player: playerTwo });

  playerOne.hideHPBar();
  playerTwo.hideHPBar();

  let currentPlayer = playerOne;
  let otherPlayer = playerTwo;
  let turnActive = true;


  let gameActive = true;

  gameScreenManager.initialize();

  const switchTurn = () => {
    currentPlayer.removeKeyboardControls();
    currentPlayer.resetPlayerMotorSpeed();
    currentPlayer.resetMoveDist();

    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    otherPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

    currentPlayer.setupKeyboardControls();
    currentPlayer.resetMoveDist();
    turnActive = true;
  };

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

  playerOne.on("shellSequenceComplete", () =>
    handleShellSequenceEnd(playerOne),
  );
  playerTwo.on("shellSequenceComplete", () =>
    handleShellSequenceEnd(playerTwo),
  );

  playerOne.on("hit", () => {
    playerTwo.updatePlayerHealthBar();
    playerTwo.revealHPBar();
    playerTwo.hideHPBar();

    if (playerTwo.hp <= 0) {
      gameActive = false;
      gameScreenManager.showDeathScreen(playerOne.name);
    }
  });

  playerTwo.on("hit", () => {
    playerOne.updatePlayerHealthBar();
    playerOne.revealHPBar();
    playerOne.hideHPBar();

    if (playerOne.hp <= 0) {
      gameActive = false;
      gameScreenManager.showDeathScreen(playerTwo.name);
    }
  });

  playerOne.on("self-hit", () => {
    playerOne.updatePlayerHealthBar();
    playerOne.revealHPBar();
    playerOne.hideHPBar();

    if (playerOne.hp <= 0) {
      gameActive = false;
      gameScreenManager.showDeathScreen(playerTwo.name);
    }
  });

  playerTwo.on("self-hit", () => {
    playerTwo.updatePlayerHealthBar();
    playerTwo.revealHPBar();
    playerTwo.hideHPBar();

    if (playerTwo.hp <= 0) {
      gameActive = false;
      gameScreenManager.showDeathScreen(playerOne.name);
    }
  });

  currentPlayer.setupKeyboardControls();
  app.ticker.maxFPS = 60;

  // INFO: Set up game screen manager event handlers
  gameScreenManager.on("game-paused", () => {
    app.ticker.stop();
    currentPlayer.removeKeyboardControls();
  });

  gameScreenManager.on("game-resumed", () => {
    app.ticker.start();
    currentPlayer.setupKeyboardControls();
  });

  gameScreenManager.on("quit-to-menu", () => {
    app.ticker.stop();
    playerOne.destroy();
    playerTwo.destroy();
    gameScreenManager.cleanup();

    document.body.removeChild(app.canvas);
    createMainMenu();
  });

  gameScreenManager.on("restart-game", () => {
    app.ticker.stop();
    playerOne.destroy();
    playerTwo.destroy();
    gameScreenManager.cleanup();

    document.body.removeChild(app.canvas);
    startGame();
  });


  // const debugRenderer = new DebugRenderer(world, app, scaleFactor);

  app.ticker.add(() => {
    if (!gameActive) return;
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

    if (
      playerOne.shotOutOfBounds &&
      currentPlayer === playerOne &&
      !turnActive
    ) {
      playerOne.shotOutOfBounds = false;
      handleShellSequenceEnd(playerOne);
    }
    if (
      playerTwo.shotOutOfBounds &&
      currentPlayer === playerTwo &&
      !turnActive
    ) {
      playerTwo.shotOutOfBounds = false;
      handleShellSequenceEnd(playerTwo);
    }

    playerOne.updatePosPlayerHealthBar();
    playerTwo.updatePosPlayerHealthBar();

    playerOne.destroyShellOutsideContactEvent();
    playerTwo.destroyShellOutsideContactEvent();

    debugRenderer.render();
  });

  window.addEventListener("keydown", (e) => {
    // INFO: Pauses the game on escape button press
    if (e.key === "27" && gameActive) {
      if (!gameScreenManager.isPaused) {
        gameScreenManager.pauseGame();
      } else {
        gameScreenManager.resumeGame();
      }
    }
  });
}

createMainMenu();
