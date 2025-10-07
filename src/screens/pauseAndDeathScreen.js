import { EventEmitter } from "pixi.js";

export class GameScreenManager extends EventEmitter {
  constructor() {
    super();
    this.pauseMenu = null;
    this.deathScreen = null;
    this.isPaused = false;
    this.isGameOver = false;
    this.escKeyListener = this.handleEscKey.bind(this);
  }

  initialize() {
    // Set up the escape key listener for pausing
    window.addEventListener("keydown", this.escKeyListener);
  }

  handleEscKey(e) {
    if (e.key === "Escape" && !this.isGameOver) {
      if (this.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    }
  }

  pauseGame() {
    if (!this.isPaused && !this.isGameOver) {
      this.isPaused = true;
      this.createPauseMenu();
      this.emit("game-paused");
    }
  }

  resumeGame() {
    if (this.isPaused) {
      this.isPaused = false;
      this.removePauseMenu();
      this.emit("game-resumed");
    }
  }

  showDeathScreen(winnerName) {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.createDeathScreen(winnerName);
      this.emit("game-over", winnerName);
    }
  }

  createPauseMenu() {
    // Remove any existing pause menu
    this.removePauseMenu();

    // Create the pause menu container
    const pauseMenu = document.createElement("div");
    pauseMenu.id = "pause-menu";

    // Create the menu content container
    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    // Create the title
    const title = document.createElement("h2");
    title.textContent = "Game Paused";
    menuContent.appendChild(title);

    // Create the buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    // Create the resume button
    const resumeButton = document.createElement("button");
    resumeButton.textContent = "Resume Game";
    resumeButton.addEventListener("click", () => this.resumeGame());
    buttonsContainer.appendChild(resumeButton);

    // Create the main menu button
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Quit to Main Menu";
    mainMenuButton.addEventListener("click", () => {
      this.emit("quit-to-menu");
      this.removePauseMenu();
    });
    buttonsContainer.appendChild(mainMenuButton);

    // Add the buttons to the menu content
    menuContent.appendChild(buttonsContainer);

    // Add the menu content to the pause menu
    pauseMenu.appendChild(menuContent);

    // Add the pause menu to the document
    document.body.appendChild(pauseMenu);

    // Store a reference to the pause menu
    this.pauseMenu = pauseMenu;
  }

  removePauseMenu() {
    if (this.pauseMenu && this.pauseMenu.parentNode) {
      this.pauseMenu.parentNode.removeChild(this.pauseMenu);
      this.pauseMenu = null;
    }
  }

  createDeathScreen(winnerName) {
    // Remove any existing death screen
    this.removeDeathScreen();

    // Create the death screen container
    const deathScreen = document.createElement("div");
    deathScreen.id = "death-screen";

    // Create the menu content container
    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    // Create the title
    const title = document.createElement("h2");
    title.textContent = "Game Over!";
    menuContent.appendChild(title);

    // Create the winner text
    const winnerText = document.createElement("p");
    winnerText.className = "winner-text";
    winnerText.textContent = `${winnerName} Wins!`;
    menuContent.appendChild(winnerText);

    // Create the buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    // Create the play again button
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.addEventListener("click", () => {
      this.emit("restart-game");
      this.removeDeathScreen();
    });
    buttonsContainer.appendChild(playAgainButton);

    // Create the main menu button
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Back to Main Menu";
    mainMenuButton.addEventListener("click", () => {
      this.emit("quit-to-menu");
      this.removeDeathScreen();
    });
    buttonsContainer.appendChild(mainMenuButton);

    // Add the buttons to the menu content
    menuContent.appendChild(buttonsContainer);

    // Add the menu content to the death screen
    deathScreen.appendChild(menuContent);

    // Add the death screen to the document
    document.body.appendChild(deathScreen);

    // Store a reference to the death screen
    this.deathScreen = deathScreen;
  }

  removeDeathScreen() {
    if (this.deathScreen && this.deathScreen.parentNode) {
      this.deathScreen.parentNode.removeChild(this.deathScreen);
      this.deathScreen = null;
    }
  }

  cleanup() {
    // Remove event listeners when done
    window.removeEventListener("keydown", this.escKeyListener);
    this.removePauseMenu();
    this.removeDeathScreen();
  }
};



 export class TurnChangeDisplay extends EventEmitter {
   constructor(_turnAnnouncement) {
     super();
     this._turnAnnouncement = _turnAnnouncement;
   };

   showTurnAnnouncement( message) {
     const duration = 1500;
     const holdRatio = 0.5;
     const fontSize = 36;

     if (_turnAnnouncement) {
       _turnAnnouncement.parent && _turnAnnouncement.parent.removeChild(_turnAnnouncement);
       _turnAnnouncement = null;
     }

     const style = new TextStyle({
       fontFamily: "Arial", fontSize,
       fontWeight: "700", fill: "#ffffff",
       stroke: "#000000", strokeThickness: 4,
       align: "center",
     });

     const text = new Text(message, style);
     text.anchor.set(0.5);
     text.x = app.renderer.width / 2;
     text.y = Math.max(80, app.renderer.height * 0.12);
     text.alpha = 0;
     text.zIndex = 1000;

     // ensure stage sorts by zIndex (if not using layers)
     if (app.stage.sortableChildren === undefined)
       app.stage.sortableChildren = true;
     text.zIndex = 9999;

     app.stage.addChild(text);
     _turnAnnouncement = text;

     const total = duration;
     const hold = total * holdRatio;
     const fade = (total - hold) / 2;

     let elapsed = 0;
     const tickerCallback = (delta) => {
       const deltaMs = app.ticker.deltaMS ?? (1000 / 60) * delta;
       elapsed += deltaMs;

       if (elapsed <= fade) { // fade in
         text.alpha = Math.min(1, elapsed / fade);
       } else if (elapsed <= fade + hold) { // hold
         text.alpha = 1;
       } else if (elapsed <= fade + hold + fade) { // fade out
         text.alpha = Math.max(0, 1 - (elapsed - fade - hold) / fade);
       } else { // done
         app.ticker.remove(tickerCallback);
         text.parent && text.parent.removeChild(text);
         if (_turnAnnouncement === text) _turnAnnouncement = null;
       }
     };

     app.ticker.add(tickerCallback);
     return text;
   }


 }
