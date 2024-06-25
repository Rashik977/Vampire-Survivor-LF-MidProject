import { Global } from "../Global";
import { players } from "../Player/PlayerInfo";
import { displayScore } from "./drawScore";
import { backgroundSelection } from "./backgroundSelection";

// function to display the player selection screen
export function playerSelection() {
  let selectedCharacter: any = null;

  // DOM elements
  const playerSelectionScreen = document.querySelector(
    ".player-selection"
  ) as HTMLElement;
  const playerSelectionItems = document.querySelector(
    ".player-selection__items"
  ) as HTMLElement;
  const playerStats = document.querySelector(".player-stats") as HTMLElement;
  const playerAlert = document.querySelector(".player-alert") as HTMLElement;
  const nextButton = document.querySelector(".btn--next") as HTMLButtonElement;
  const buyButton = document.querySelector(".btn--buy") as HTMLButtonElement;

  // Display the player selection screen
  playerSelectionScreen.classList.remove("hidden");
  playerSelectionScreen.classList.add("screen");

  // Display the player images
  players.forEach((player: any) => {
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
      if (selectedCharacter.purchased) {
        nextButton.classList.remove("hidden");
        buyButton.classList.add("hidden");
      } else {
        nextButton.classList.add("hidden");
        buyButton.classList.remove("hidden");
        buyButton.innerText = `Buy for ${player.cost} coins`;
      }
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

  // Event listeners for the next button
  nextButton.addEventListener("click", () => {
    Global.PLAYER_INDEX = players.indexOf(selectedCharacter);

    playerSelectionScreen.classList.add("hidden");
    playerSelectionScreen.classList.remove("screen");
    playerSelectionScreen.style.display = "none";

    // Display the background selection screen
    backgroundSelection();
  });

  // Event listeners for the buy button
  buyButton.addEventListener("click", () => {
    if (Global.SCORE >= selectedCharacter.cost) {
      Global.SCORE -= selectedCharacter.cost;
      localStorage.setItem("score", Global.SCORE.toString());
      selectedCharacter.purchased = true;
      players[players.indexOf(selectedCharacter)].purchased = true;
      localStorage.setItem("players", JSON.stringify(players));
      buyButton.classList.add("hidden");
      nextButton.classList.remove("hidden");

      displayScore();
    } else {
      playerAlert.classList.remove("hidden");
      setTimeout(() => {
        playerAlert.classList.add("hidden");
      }, 2000);
    }
  });
}
