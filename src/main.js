// importing necessary libraries, and external classes
import { slider } from './core/slider.js';
import { Application, Assets, Text, Graphics, Sprite, SCALE_MODES } from 'pixi.js';
import { tankPlayer } from "./core/player"; 
import { Ground } from "./core/ground";
import { trajectoryCalculator } from './core/trajectoryCalculator.js';

(async () => { // https://developer.mozilla.org/en-US/docs/Glossary/IIFE IIFE (Immediately Invoked Function Expression) JS function that runs as soon as it is defined

  // app setup 
  const app = new Application(); // instantiating a new instance of application class
  await app.init({ // sets up the 'canvas'; this is the area on the webpage that is controlled and managed by pixijs
    resizeTo: window
  });
  app.canvas.style.position = 'absolute'; // line required in order to get rid of side bars
  document.body.appendChild(app.canvas); // adds canvas to body
  
  // Adding background
  const background = new Background(app.renderer.height - 150, app.renderer.width);
  await background.initialiseBackground();
  app.stage.addChild(background.getBackground());

  // Adding ground
  const activeGround = new Ground(app)
  await activeGround.initialiseGround();
  app.stage.addChild(activeGround.getGround());

  // Adding player + setting up keyboard controls for movement
  console.log("render height", app.renderer.height)
  const testPlayer = new tankPlayer(400, app.renderer.height - 251, app);
  await testPlayer.initialiseSprite();
  app.stage.addChild(testPlayer.getSprite())
  testPlayer.setupKeyboardControls();

  // create sliders for both initial velocitym and launch angle (in degrees)
  const sliderVelocity = new slider(100, 100, app, 320, "Initial Velocity");
  sliderVelocity.addGraphicsToStage();

  const sliderLaunchAngle = new slider(100, 200, app, 320, "Launch Angle");
  sliderLaunchAngle.addGraphicsToStage();

  // create test bezier curve
  //const testBezier = new trajectoryCalculator(app, 50, 50);
  //testBezier.createBezier();
  //app.stage.addChild(testBezier.getBezierCurve());

  // create ticker in order to update sprite positioning
  app.ticker.add(() => {
    testPlayer.updatePlayerPosition();
    testPlayer.updateBullets();
    if (testPlayer.checkSpaceBarInput()) {
      testPlayer.createBullet();
    }
  })

  // Testing Collision
  activeGround.isThereCollision(testPlayer);
})();

