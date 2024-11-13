### File Structure

my-pixi-game/\
│\
├── assets/               # All game assets (images, sounds, etc.)\
│   ├── images/           # Sprites, backgrounds, UI elements\
│   ├── sounds/           # Sound effects, music\
│   └── fonts/            # Custom fonts, if any\
│\
├── src/                  # All source code\
│   ├── core/             # Core game logic\
│   │   ├── Game.js       # Main game setup and loop\
│   │   ├── Loader.js     # Asset loading logic\
│   │   ├── SceneManager.js # Manages different scenes (e.g., menus, game levels)\
│   │   └── Utils.js      # Utility functions\
│   │
│   ├── scenes/           # Individual game scenes (menu, game, game over)\
│   │   ├── MainMenu.js   # Main menu scene\
│   │   ├── GameScene.js  # Main game scene\
│   │   └── GameOver.js   # Game over scene\
│   │\
│   ├── objects/          # Game objects (player, enemies, items, etc.)\
│   │   ├── Player.js     # Player character class\
│   │   ├── Enemy.js      # Enemy character class\
│   │   └── Item.js       # Collectible item class\
│   │\
│   ├── ui/               # UI elements (scoreboard, health bar, etc.)\
│   │   ├── Button.js     # Reusable button class\
│   │   └── Scoreboard.js # Scoreboard display\
│   │\
│   └── main.js           # Entry point of the application (sets up PixiJS)\
│\
├── config/               # Configuration files\
│   └── settings.js       # Game settings (e.g., screen width, height, game speed)\
│\
├── index.html            # Main HTML file to load the game\
├── styles.css            # Optional: CSS for the game's HTML container\
└── package.json          # Project metadata and dependencies\

### Development Timeline
- [ ] Implementing Bullet Trajectory (Alejandro)
- [x] Collisions between players and the ground
- [x] Main game loop and turn by turn play
- [x] Enemy tank
- [ ] Health and death
- [ ] Game screens (start -> select tank -> death)
- [ ] Complex terrain (hills and cliff) (chris)
- [ ] Terrain destruction
- [ ] Multiplayer

### Possible features:
- [ ] Larger and more varied set of maps
- [ ] Different tank options
- [ ] Play against AI
