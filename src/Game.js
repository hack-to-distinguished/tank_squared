const app = new PIXI.Application(); // makes a new instantiated pixi application
await app.init({ width: 1280, height: 720 }); // background for the game

// load the PNG asynchronously/ creating the sprite itself
await PIXI.Assets.load('assets/images/tank.png');
let playerOne = PIXI.Sprite.from('assets/images/tank.png');
playerOne.height = 100;
playerOne.width = 225;
playerOne.x = width/2;
playerOne.y = width/2;
document.body.appendChild(app.canvas);
app.stage.addChild(playerOne);


// This is for updating the game environment itself
// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((ticker) => {
    // Add the time to our total elapsed time
    elapsed += ticker.deltaTime;
    // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    // by 50 to slow the animation down a bit...
    playerOne.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});