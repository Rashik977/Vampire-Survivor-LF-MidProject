import { GameInitialize } from "../GameInitialize";
import { Global } from "../Global";
import { players } from "../Player/PlayerInfo";

export function startGame() {
  const startGamebtn = document.querySelector(
    ".btn--start"
  ) as HTMLButtonElement;
  startGamebtn.addEventListener("click", () => {
    const startScreen = document.querySelector(".start-menu") as HTMLElement;
    startScreen.classList.add("hidden");
    // Start the game loop
    playerSelection();
  });
}

function playerSelection() {
  let selectedCharacter: any = null;

  const playerSelectionScreen = document.querySelector(
    ".player-selection"
  ) as HTMLElement;
  const playerSelectionItems = document.querySelector(
    ".player-selection__items"
  ) as HTMLElement;
  const playerStats = document.querySelector(".player-stats") as HTMLElement;
  const nextButton = document.querySelector(".btn--next") as HTMLButtonElement;
  playerSelectionScreen.classList.remove("hidden");
  playerSelectionScreen.classList.add("screen");

  players.forEach((player) => {
    const img = document.createElement("img");
    img.src = player.imgSrc;
    img.alt = player.name;
    img.addEventListener("mouseover", () => {
      if (player != selectedCharacter) img.style.border = "2px solid yellow";
    });
    img.addEventListener("mouseout", () => {
      if (player != selectedCharacter) img.style.border = "none";
    });
    img.addEventListener("click", () => {
      selectedCharacter = player;
      playerStats.innerText = player.stats;
      playerStats.classList.remove("hidden");
      nextButton.classList.remove("hidden");
      const selectedPlayer = document.querySelectorAll(
        ".player-selection__items img"
      ) as NodeListOf<HTMLImageElement>;
      selectedPlayer.forEach((el) => {
        el.style.border = "none";
      });
      img.style.border = "2px solid green";
    });
    playerSelectionItems.appendChild(img);
  });

  nextButton.addEventListener("click", () => {
    Global.PLAYER_INDEX = players.indexOf(selectedCharacter);
    const screen = document.querySelector(
      ".start-screen-wrapper"
    ) as HTMLElement;
    screen.classList.add("hidden");
    GameInitialize.init();
  });
}
