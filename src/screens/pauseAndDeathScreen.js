import { EventEmitter } from "pixi.js";

class GameScreenManager extends EventEmitter {
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

    // Set up the escape key listener for pausing
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
    // Remove any existing how to play screen
    this.removeHowToPlayScreen();

    // Create the how to play screen container
    const howToPlayScreen = document.createElement("div");
    howToPlayScreen.id = "how-to-play-screen";

    // Create the menu content container
    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    // Create the title
    const title = document.createElement("h2");
    title.textContent = "How to Play";
    menuContent.appendChild(title);

    // Create the controls content
    const controlsContent = document.createElement("div");
    controlsContent.className = "controls-content";

    // Player Controls
    const playerSection = document.createElement("div");
    playerSection.className = "controls-section";
    
    const playerTitle = document.createElement("h3");
    playerTitle.textContent = "Player Controls";
    playerSection.appendChild(playerTitle);

    const playerMove = document.createElement("p");
    playerMove.textContent = "Move: A / D";
    playerSection.appendChild(playerMove);

    const playerAim = document.createElement("p");
    playerAim.textContent = "Aim: W / S";
    playerSection.appendChild(playerAim);

    const playerFire = document.createElement("p");
    playerFire.textContent = "Fire: Space (hold to charge)";
    playerSection.appendChild(playerFire);

    controlsContent.appendChild(playerSection);

    // Game Instructions
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

    // Add the controls content to the menu
    menuContent.appendChild(controlsContent);

    // Create the buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "menu-buttons";

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
      this.removeHowToPlayScreen();
      if (this.isPaused && this.pauseMenu) {
        this.pauseMenu.style.display = 'flex';
      }
    });
    buttonsContainer.appendChild(closeButton);

    // Add the buttons to the menu content
    menuContent.appendChild(buttonsContainer);

    // Add the menu content to the how to play screen
    howToPlayScreen.appendChild(menuContent);

    // Add the how to play screen to the document
    document.body.appendChild(howToPlayScreen);

    // Store a reference to the how to play screen
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

    // Create the how to play button
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
    this.removeHowToPlayScreen();
    this.initialised = false;

    this.removeAllListeners();
  }
}

// Export a singleton instance to be shared across the application
export const gameScreenManager = new GameScreenManager();
