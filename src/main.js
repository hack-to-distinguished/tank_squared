import { Application } from "pixi.js"; // import application class
import { tankPlayer } from "./core/player"; // import player class from js file
import { bulletProjectile } from "./core/bullet.js";
import { Ground } from "./core/background.js";
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
  activeGround.initialiseGround();
  app.stage.addChild(activeGround.getGround());

  // Adding player
  const testPlayer = new tankPlayer(400, app.renderer.height - 251);
  await testPlayer.initialiseSprite();
  app.stage.addChild(testPlayer.getSprite())

  // Adding a test bullet
  const bullet = new bulletProjectile(200, 200, app);
  await bullet.initialiseSprite();
  app.stage.addChild(bullet.getSprite());

  testPlayer.setupKeyboardControls();

  // testing userinput (separate from player class, can't find way to wrap it inside an oop class), this will be used for firing a bulletProjectile
  window.addEventListener("keydown", checkForSpaceBarPress);

  function checkForSpaceBarPress(e) {
    if (e.keyCode == 32) {
      console.log("Fire!");
      return true;
    }
  }

  function createBullet() {
    const bullet = new bulletProjectile(200, 200, app);
    return bullet;
  }

  function fireBullet() {
    // add functionality to this later
  }


  // create ticker in order to update sprite positioning
  app.ticker.add(() => {
    testPlayer.updatePlayerPosition();
  })

})();

