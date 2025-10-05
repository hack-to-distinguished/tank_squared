import { EventEmitter } from "pixi.js";

class GameScreenManager extends EventEmitter {
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
}

// Export a singleton instance to be shared across the application
export const gameScreenManager = new GameScreenManager();
