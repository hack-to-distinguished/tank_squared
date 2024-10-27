import { Application, Sprite, Assets, Ticker } from "pixi.js"; // import application class
import { tankPlayer } from "./player"; // import player class from js file

// let elapsed = 0.0;

(async() => { // https://developer.mozilla.org/en-US/docs/Glossary/IIFE IIFE (Immediately Invoked Function Expression) JS function that runs as soon as it is defined

    // app setup 
    const app = new Application(); // instantiating a new instance of application class
    await app.init({ // sets up the 'canvas'; this is the area on the webpage that is controlled and managed by pixijs
        resizeTo: window
    });
    app.canvas.style.position = 'absolute'; // line required in order to get rid of side bars
    document.body.appendChild(app.canvas); // adds canvas to body

    const testPlayer = new tankPlayer(400, 400);
    await testPlayer.initialiseSprite();
    // app.stage.addChild(testPlayer.getSprite());
    testPlayer.addToStage(app);

    // const keysDown = testPlayer.keysDown;
    // window.addEventListener("keydown", keysDown); // event object is automatically passed through to the keysDown method

    // testPlayer.setupKeyboardControls();

    testPlayer.setupKeyboardControls();

    // create ticker in order to update sprite positioning
    app.ticker.add(() => {
        // testPlayer.getSprite().x -= 10;
        // testPlayer.updatePlayerPosition();
        testPlayer.updatePlayerPosition();
    })

})();

