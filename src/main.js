import { Application, Sprite, Assets, Ticker } from "pixi.js"; // import application class
import { tankPlayer } from "./core/player"; // import player class from js file
import { Ground } from "./core/ground";
import { Background } from "./scenes/mapImage";

(async() => { // https://developer.mozilla.org/en-US/docs/Glossary/IIFE IIFE (Immediately Invoked Function Expression) JS function that runs as soon as it is defined

    // app setup 
    const app = new Application(); // instantiating a new instance of application class

    await app.init({ // sets up the 'canvas'; this is the area on the webpage that is controlled and managed by pixijs
        resizeTo: window,
    });
    app.canvas.style.position = 'absolute'; // line required in order to get rid of side bars
    document.body.appendChild(app.canvas); // adds canvas to body

    // We re-use these a lot so lets save them
    const [appHeight, appWidth] = [app.renderer.height, app.renderer.width];

    // Adding background
    const background = new Background(appHeight - 150, appWidth);
    await background.initialiseBackground();
    app.stage.addChild(background.getBackground());

    // Adding ground
    const activeGround = new Ground(app)
    await activeGround.initialiseGround();
    app.stage.addChild(activeGround.getGround());

    // Adding player
    let [playerOneX, playerOneY] = [400, appHeight - 300];
    const playerOne = new tankPlayer(playerOneX, playerOneY);
    await playerOne.initialiseSprite();
    playerOne.addToStage(app);
    playerOne.setupKeyboardControls();

    // create ticker in order to update sprite positioning
    app.ticker.add(() => {
        playerOne.updatePlayerPosition();
    })

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

