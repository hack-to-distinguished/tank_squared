import { EventEmitter, Text, TextStyle } from "pixi.js";

export class GameScreenManager extends EventEmitter {
  constructor() {
    super();
    this.pauseMenu = null;
    this.deathScreen = null;
    this.howToPlayScreen = null;
    this.isPaused = false;
    this.isGameOver = false;
    this.escKeyListener = this.handleEscKey.bind(this);
    this.initialised = false;
  }

  initialize() {
    if (this.initialised) {
      this.cleanup();
    }

    this.isPaused = false;
    this.isGameOver = false;
    this.pauseMenu = null;
    this.deathScreen = null;

    window.addEventListener("keydown", this.escKeyListener);
    this.initialised = true;
  }

  handleEscKey(e) {
    if (e.key === "Escape" && !this.isGameOver) {
      if (this.howToPlayScreen) {
        this.removeHowToPlayScreen();
        return;
      } else if (!this.isGameOver) {
        if (this.isPaused) {
          this.resumeGame();
        } else {
          this.pauseGame();
        }
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

  showHowToPlayScreen() {
    if (this.isPaused && this.pauseMenu) {
      this.pauseMenu.style.display = 'none';
    }
    this.createHowToPlayScreen();
  }

  createHowToPlayScreen() {
    this.removeHowToPlayScreen();

    const howToPlayScreen = document.createElement("div");
    howToPlayScreen.id = "how-to-play-screen";

    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    const title = document.createElement("h2");
    title.textContent = "How to Play";
    menuContent.appendChild(title);

    const controlsContent = document.createElement("div");
    controlsContent.className = "controls-content";

    const player1Section = document.createElement("div");
    player1Section.className = "controls-section";
    
    const player1Title = document.createElement("h3");
    player1Title.textContent = "Player 1 Controls";
    player1Section.appendChild(player1Title);

    const player1Move = document.createElement("p");
    player1Move.textContent = "Move: A / D";
    player1Section.appendChild(player1Move);

    const player1Aim = document.createElement("p");
    player1Aim.textContent = "Aim: W / S";
    player1Section.appendChild(player1Aim);

    const player1Fire = document.createElement("p");
    player1Fire.textContent = "Fire: Space (hold to charge)";
    player1Section.appendChild(player1Fire);

    controlsContent.appendChild(player1Section);
    
    const player2Section = document.createElement("div");
    player2Section.className = "controls-section";
    
    const player2Title = document.createElement("h3");
    player2Title.textContent = "Player 2 Controls";
    player2Section.appendChild(player2Title);

    const player2Move = document.createElement("p");
    player2Move.textContent = "Move: ← / → Arrow Keys";
    player2Section.appendChild(player2Move);

    const player2Aim = document.createElement("p");
    player2Aim.textContent = "Aim: ↑ / ↓ Arrow Keys";
    player2Section.appendChild(player2Aim);

    const player2Fire = document.createElement("p");
    player2Fire.textContent = "Fire: Enter Key (hold to charge)";
    player2Section.appendChild(player2Fire);

    controlsContent.appendChild(player2Section);

    const instructionsSection = document.createElement("div");
    instructionsSection.className = "controls-section";
    
    const instructionsTitle = document.createElement("h3");
    instructionsTitle.textContent = "Game Instructions";
    instructionsSection.appendChild(instructionsTitle);

    const instruction1 = document.createElement("p");
    instruction1.textContent = "• Take turns moving and shooting";
    instructionsSection.appendChild(instruction1);

    const instruction2 = document.createElement("p");
    instruction2.textContent = "• Destroy the other player's tank to win";
    instructionsSection.appendChild(instruction2);

    const instruction3 = document.createElement("p");
    instruction3.textContent = "• Watch your health bar - don't get hit!";
    instructionsSection.appendChild(instruction3);

    controlsContent.appendChild(instructionsSection);

    menuContent.appendChild(controlsContent);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
      this.removeHowToPlayScreen();
      if (this.isPaused && this.pauseMenu) {
        this.pauseMenu.style.display = 'flex';
      }
    });
    buttonsContainer.appendChild(closeButton);

    menuContent.appendChild(buttonsContainer);

    howToPlayScreen.appendChild(menuContent);

    document.body.appendChild(howToPlayScreen);

    this.howToPlayScreen = howToPlayScreen;
  }

  removeHowToPlayScreen() {
    if (this.howToPlayScreen && this.howToPlayScreen.parentNode) {
        this.howToPlayScreen.parentNode.removeChild(this.howToPlayScreen);
        this.howToPlayScreen = null;

        if (this.isPaused && this.pauseMenu) {
          this.pauseMenu.style.display = 'flex';
        }
    }
  }

  createPauseMenu() {
    this.removePauseMenu();

    const pauseMenu = document.createElement("div");
    pauseMenu.id = "pause-menu";

    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    const title = document.createElement("h2");
    title.textContent = "Game Paused";
    menuContent.appendChild(title);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    const resumeButton = document.createElement("button");
    resumeButton.textContent = "Resume Game";
    resumeButton.addEventListener("click", () => this.resumeGame());
    buttonsContainer.appendChild(resumeButton);

    const howToPlayButton = document.createElement("button");
    howToPlayButton.textContent = "How to Play";
    howToPlayButton.addEventListener("click", () => {
      if (this.pauseMenu) {
        this.pauseMenu.style.display = "none";
      }
      // this.removePauseMenu();
      this.showHowToPlayScreen();
    });
    buttonsContainer.appendChild(howToPlayButton);

    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Quit to Main Menu";
    mainMenuButton.addEventListener("click", () => {
      this.emit("quit-to-menu");
      this.removePauseMenu();
    });
    buttonsContainer.appendChild(mainMenuButton);

    menuContent.appendChild(buttonsContainer);

    pauseMenu.appendChild(menuContent);

    document.body.appendChild(pauseMenu);

    this.pauseMenu = pauseMenu;
  }

  removePauseMenu() {
    if (this.pauseMenu && this.pauseMenu.parentNode) {
      this.pauseMenu.parentNode.removeChild(this.pauseMenu);
      this.pauseMenu = null;
    }
  }

  createDeathScreen(winnerName) {
    this.removeDeathScreen();

    const deathScreen = document.createElement("div");
    deathScreen.id = "death-screen";

    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    const title = document.createElement("h2");
    title.textContent = "Game Over!";
    menuContent.appendChild(title);

    const winnerText = document.createElement("p");
    winnerText.className = "winner-text";
    winnerText.textContent = `${winnerName} Wins!`;
    menuContent.appendChild(winnerText);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.addEventListener("click", () => {
      this.emit("restart-game");
      this.removeDeathScreen();
    });
    buttonsContainer.appendChild(playAgainButton);

    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Back to Main Menu";
    mainMenuButton.addEventListener("click", () => {
      this.emit("quit-to-menu");
      this.removeDeathScreen();
    });
    buttonsContainer.appendChild(mainMenuButton);

    menuContent.appendChild(buttonsContainer);

    deathScreen.appendChild(menuContent);

    document.body.appendChild(deathScreen);

    this.deathScreen = deathScreen;
  }

  removeDeathScreen() {
    if (this.deathScreen && this.deathScreen.parentNode) {
      this.deathScreen.parentNode.removeChild(this.deathScreen);
      this.deathScreen = null;
    }
  }

  cleanup() {
    window.removeEventListener("keydown", this.escKeyListener);
    this.removePauseMenu();
    this.removeDeathScreen();
    this.removeHowToPlayScreen();
    this.initialised = false;

    this.removeAllListeners();
  }
};



export class TurnChangeDisplay extends EventEmitter {
  constructor(app, _turnAnnouncement) {
    super();
    this._turnAnnouncement = _turnAnnouncement;
    this.app = app; 
  };

  showTurnAnnouncement( message) {
    const duration = 1500;
    const holdRatio = 0.5;
    const fontSize = 36;

    if (this._turnAnnouncement) {
      this._turnAnnouncement.parent && this._turnAnnouncement.parent.removeChild(this._turnAnnouncement);
      this._turnAnnouncement = null;
    }

    const style = new TextStyle({
      fontFamily: "Arial", fontSize,
      fontWeight: "700", fill: "#ffffff",
      stroke: "#000000", strokeThickness: 4,
      align: "center",
    });

    const text = new Text(message, style);
    text.anchor.set(0.5);
    text.x = this.app.renderer.width / 2;
    text.y = Math.max(80, this.app.renderer.height * 0.12);
    text.alpha = 0;
    text.zIndex = 1000;

    // ensure stage sorts by zIndex (if not using layers)
    if (this.app.stage.sortableChildren === undefined)
      this.app.stage.sortableChildren = true;
    text.zIndex = 9999;

    this.app.stage.addChild(text);
    this._turnAnnouncement = text;

    const total = duration;
    const hold = total * holdRatio;
    const fade = (total - hold) / 2;

    let elapsed = 0;
    const tickerCallback = (delta) => {
      const deltaMs = this.app.ticker.deltaMS ?? (1000 / 60) * delta;
      elapsed += deltaMs;

      if (elapsed <= fade) { // fade in
        text.alpha = Math.min(1, elapsed / fade);
      } else if (elapsed <= fade + hold) { // hold
        text.alpha = 1;
      } else if (elapsed <= fade + hold + fade) { // fade out
        text.alpha = Math.max(0, 1 - (elapsed - fade - hold) / fade);
      } else { // done
        this.app.ticker.remove(tickerCallback);
        text.parent && text.parent.removeChild(text);
        if (this._turnAnnouncement === text) this._turnAnnouncement = null;
      }
    };

    this.app.ticker.add(tickerCallback);
    return text;
  };

};
