import { Global } from "../Global";

// function to display the score on the menu screen
export function displayScore() {
  const scoreDisplay = document.querySelector(".score") as HTMLElement;
  scoreDisplay.innerText = `Score: ${Global.SCORE}`;
}
