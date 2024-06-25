import { Global } from "../Global";

export function displayScore() {
  const scoreDisplay = document.querySelector(".score") as HTMLElement;
  scoreDisplay.innerText = `Score: ${Global.SCORE}`;
}
