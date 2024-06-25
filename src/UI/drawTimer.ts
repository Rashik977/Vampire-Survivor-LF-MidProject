import { formatTime } from "../Utils/formatTime";
import { Global } from "../Global";

// function to draw the Max timer of the player on the menu screen
export function drawTimer() {
  const time = document.querySelector(".time") as HTMLElement;
  const timer = formatTime(Global.HIGH_TIMER);
  time.innerText = `Max Time Survived: ${timer}`;
}
