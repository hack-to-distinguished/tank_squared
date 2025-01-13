//export function runGame(){
//    console.log("Running game");
//    document.getElementById("newGame").style.display = "none";
//    document.getElementById("theHead").style.display = "none";
//
//    document.getElementById("credits").style.display = "none";
//    document.getElementById("main").style.display = "block";
//    document.getElementById("creditBtn").style.display = "none";
//    //updateScore();
//    //update();
//};
//
export function createMainMenu() {
    console.log("In main menu");
    const menu = document.createElement('div');
    menu.id = 'main-menu';
    menu.style.position = 'absolute';
    menu.style.width = '100%';
    menu.style.height = '100%';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.justifyContent = 'center';
    menu.style.alignItems = 'center';
    menu.style.background = 'rgba(0, 0, 0, 0.8)';

    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '20px';
    startButton.onclick = () => {
        document.body.removeChild(menu);
        // Trigger game initialization in main.js
        import('./main.js').then(module => module.startGame());
    };

    menu.appendChild(startButton);
    document.body.appendChild(menu);
}
