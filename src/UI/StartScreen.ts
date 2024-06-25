import { displayScore } from "./drawScore";
import { drawTimer } from "./drawTimer";
import { playerSelection } from "./playerSelection";

export function startGame() {
  const startGamebtn = document.querySelector(
    ".btn--start"
  ) as HTMLButtonElement;
  startGamebtn.addEventListener("click", () => {
    const startScreen = document.querySelector(".start-menu") as HTMLElement;
    startScreen.classList.add("hidden");
    startScreen.classList.remove("screen");
    // Start the game loop
    playerSelection();
  });

  drawTimer();
  displayScore();
}
