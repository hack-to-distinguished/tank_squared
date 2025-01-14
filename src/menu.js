export function createMainMenu() {
    // INFO: Main menu container
    const menu = document.createElement("div");
    menu.id = "main-menu";
    menu.style.position = "absolute";
    menu.style.width = "100%"; // for some reason the 100% does more than the screen width/height
    menu.style.height = "100%";
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.justifyContent = "space-between"; 
    menu.style.alignItems = "center";
    menu.style.background = "rgba(0, 0, 0, 0.8)";
    menu.style.padding = "20px 0"; 

    // INFO: Welcome text container
    const title = document.createElement("div");
    title.id = "menu-title";
    title.style.width = "100%";
    title.style.textAlign = "center";

    // INFO: Welcome text
    const welcomeText = document.createElement("p");
    welcomeText.innerText = "Welcome to Tank Squared!";
    welcomeText.style.margin = "0";
    welcomeText.style.padding = "10px 20px";
    welcomeText.style.fontSize = "40px";
    welcomeText.style.color = "white";
    title.appendChild(welcomeText);
    menu.appendChild(title);


    // INFO: Charactor selector screen
    const charactorCardsContainer = document.createElement("div");
    const charactorCard1 = document.createElement("div");
    charactorCard1.innerText = "Inside the card";
    const charactorCard2 = document.createElement("div");
    charactorCard2.innerText = "Inside the card";

    charactorCardsContainer.appendChild(charactorCard1);
    charactorCardsContainer.appendChild(charactorCard2);
    menu.appendChild(charactorCardsContainer);


    // INFO: Start game button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.flexGrow = "1";

    // INFO: Start game button
    const startButton = document.createElement("button");
    startButton.innerText = "Start Game";
    startButton.style.padding = "10px 20px";
    startButton.style.fontSize = "20px";
    startButton.onclick = () => {
        document.body.removeChild(menu);
        import("./main.js").then(module => module.startGame());
    };
    buttonContainer.appendChild(startButton);

    menu.appendChild(buttonContainer);

    document.body.appendChild(menu);
}
