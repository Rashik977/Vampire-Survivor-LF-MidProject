import { Global } from "../Global";
import { Player } from "../Player";

export function drawLevelProgressBar(player: Player) {
  const progressBarWidth = Global.CANVAS_WIDTH - 40;
  const progressBarHeight = 30;
  const progressBarX = 20 - Global.offsetX;
  const progressBarY = 10 - Global.offsetY;
  const requiredDiamondsForNextLevel = player.level * 5;
  const progressPercentage =
    (player.collectedDiamonds % requiredDiamondsForNextLevel) /
    requiredDiamondsForNextLevel;

  // Draw the progress bar background
  Global.CTX.fillStyle = "gray";
  Global.CTX.fillRect(
    progressBarX,
    progressBarY,
    progressBarWidth,
    progressBarHeight
  );

  // Draw the filled part of the progress bar
  Global.CTX.fillStyle = "green";
  Global.CTX.fillRect(
    progressBarX,
    progressBarY,
    progressBarWidth * progressPercentage,
    progressBarHeight
  );

  // Draw the level text
  Global.CTX.fillStyle = "white";
  Global.CTX.font = "20px Arial";
  Global.CTX.fillText(
    `Level: ${player.level}`,
    progressBarX + progressBarWidth / 2 - 30,
    progressBarY + progressBarHeight / 2 + 7
  );
}
