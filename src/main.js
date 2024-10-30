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
    console.log("Bullets List: ", testPlayer.getBulletsList());
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
  // create slider for initial velocity
  const sliderWidth = 320;
  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });
  slider.x = 100;
  slider.y = 100;

  // Draw the handle
  const handle = new Graphics().circle(0, 0, 8).fill({ color: 0xffffff });
  handle.y = slider.height / 2;
  handle.x = sliderWidth / 2;
  handle.eventMode = 'static';
  handle.cursor = 'pointer';

  handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);

  app.stage.addChild(slider);
  slider.addChild(handle);

  function onDragStart() {
    app.stage.eventMode = 'static';
    app.stage.addEventListener('pointermove', onDrag);
  }

  function onDragEnd(e) {
    app.stage.eventMode = 'auto';
    app.stage.removeEventListener('pointermove', onDrag);
  }

  function onDrag(e) {
    const halfHandleWidth = handle.width / 2;
    // Set handle y-position to match pointer, clamped to (4, screen.height - 4).

    handle.x = Math.max(halfHandleWidth, Math.min(slider.toLocal(e.global).x, sliderWidth - halfHandleWidth));
    // Normalize handle position between -1 and 1.
    const t = 2 * (handle.x / sliderWidth - 0.5);
  }

  // create ticker in order to update sprite positioning
  app.ticker.add(() => {
    testPlayer.updatePlayerPosition();
    updateAllBullets();
  })
  // Testing Collision
  activeGround.isThereCollision(testPlayer);
})();

