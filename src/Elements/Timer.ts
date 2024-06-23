import { formatTime } from "../Utils/formatTime";
import { Global } from "../Global";

export function drawTimer(elapsedSeconds: number) {
  // Draw timer
  Global.CTX.fillStyle = "white";
  Global.CTX.font = "20px Gothic A1";
  Global.CTX.letterSpacing = "3px";
  const formattedTime = formatTime(elapsedSeconds);
  Global.CTX.fillText(
    `${formattedTime}`,
    Global.CANVAS_WIDTH / 2 - Global.offsetX - 10,
    70 - Global.offsetY
  );
}
