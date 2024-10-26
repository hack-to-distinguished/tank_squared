const app = new PIXI.Application(); // makes a new instantiated pixi application
await app.init({ width: 1280, height: 720 }); // background for the game

// load the PNG asynchronously/ creating the sprite itself
await PIXI.Assets.load('assets/images/tank.png');

let bullets = [];
let bulletSpeed = 10;

let playerOne = PIXI.Sprite.from('assets/images/tank.png');
playerOne.height = 100;
playerOne.width = 225;
playerOne.y = 300;
document.body.appendChild(app.canvas);
app.stage.addChild(playerOne);

// keyboard event handlers
window.addEventListener("keydown", keysDown);

// app.stage.interactive = true;
// app.stage.on("pointerdown", fireBullet);

window.addEventListener("pointerdown", fireBullet);

function fireBullet(e) {
    console.log("FIRE!");    

    bullets.push(createBullet(e));
    console.log(bullets);
} 

// Function to update the bullets' positions each frame
function updateBullets(delta) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].position.x -= bullets[i].speed;

        // Remove bullet if it goes off the screen
        if (bullets[i].position.x < 0) {
            app.stage.removeChild(bullets[i]);
            bullets.splice(i, 1);
        }
    }
}


function createBullet(e) {
    let bullet = PIXI.Sprite.from('assets/images/tank.png');
    bullet.width = 50;
    bullet.height = 50;
    bullet.speed = bulletSpeed;
    bullet.anchor.set(0.5, 0.5);
    app.stage.addChild(bullet);

    // Position the bullet at the player's position
    bullet.x = playerOne.x;
    bullet.y = playerOne.y;

    return bullet;

}

function keysDown(e) {
    if (e.keyCode == 68) {
        playerOne.x += 10;
    } 
    if (e.keyCode == 65) {
        playerOne.x -= 10;
    }
}

// This is for updating the game environment itself
// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((ticker) => {
    // Add the time to our total elapsed time
    elapsed += ticker.deltaTime;
    updateBullets(ticker);
});