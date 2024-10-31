import { slider } from './core/slider.js';
import { Application, Assets, Text, Graphics, Sprite, SCALE_MODES } from 'pixi.js';
import { tankPlayer } from "./core/player"; // import player class from js file
import { bulletProjectile } from "./core/bullet.js";
import { Ground } from "./core/ground";
(async () => { // https://developer.mozilla.org/en-US/docs/Glossary/IIFE IIFE (Immediately Invoked Function Expression) JS function that runs as soon as it is defined

  // app setup 
  const app = new Application(); // instantiating a new instance of application class
  await app.init({ // sets up the 'canvas'; this is the area on the webpage that is controlled and managed by pixijs
    resizeTo: window
  });
  app.canvas.style.position = 'absolute'; // line required in order to get rid of side bars
  document.body.appendChild(app.canvas); // adds canvas to body

  // Adding ground
  const activeGround = new Ground(app)
  await activeGround.initialiseGround();
  app.stage.addChild(activeGround.getGround());

  // Adding player + setting up keyboard controls for movement
  console.log("render height", app.renderer.height)
  const testPlayer = new tankPlayer(400, app.renderer.height - 251);
  await testPlayer.initialiseSprite();
  app.stage.addChild(testPlayer.getSprite())
  testPlayer.setupKeyboardControls();

  // Setting up bullet logic, creation, and updating
  window.addEventListener("keydown", checkForSpaceBarPress);
  function checkForSpaceBarPress(e) {
    if (e.keyCode == 32) {
      createBullet();
      return true;
    }
  }

  // instantiates new bulletProjectile object, and pushes it to player object's bullet list
  async function createBullet() {
    const bullet = new bulletProjectile(testPlayer.getX(), testPlayer.getY(), app);
    await bullet.initialiseSprite();
    app.stage.addChild(bullet.getSprite());
    console.log("Creating a new bullet!");
    testPlayer.addBulletToBullets(bullet);
  }

  // for loop used to iterate through list of bullets, and update corresponding x, y coords for each one
  function updateAllBullets() {
    for (let i = 0; i < testPlayer.getBulletsList().length; i++) {
      const projectile = testPlayer.getBulletsList()[i];
      projectile.applyGravityToVerticalMotion();
      projectile.updateBullet();

      // check if bullet has gone off the screen, if it has, then it will be deleted. 
      if (projectile.getX() > (app.canvas.width + 20) || projectile.getX() < 0) {
        app.stage.removeChild(projectile);
        testPlayer.getBulletsList().splice(i, 1);
      }
    }
  }

  // create sliders for both initial velocitym and launch angle (in degrees)
  const sliderVelocity = new slider(100, 100, app, 320, "Initial Velocity");
  sliderVelocity.addGraphicsToStage();

  const sliderLaunchAngle = new slider(100, 200, app, 320, "Launch Angle");
  sliderLaunchAngle.addGraphicsToStage();

  // create ticker in order to update sprite positioning
  app.ticker.add(() => {
    testPlayer.updatePlayerPosition();
    updateAllBullets();
  })
  // Testing Collision
  activeGround.isThereCollision(testPlayer);
})();

