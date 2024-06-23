import { Global } from "../Global";

export function deathCounter(score: number) {
  // Draw death counter
  Global.CTX.fillStyle = "white";
  Global.CTX.font = "20px Gothic A1";
  Global.CTX.letterSpacing = "3px";
  // Draw death count with skull emoji
  const skullEmoji = "💀";
  Global.CTX.fillText(
    `${skullEmoji}: ${score}`,
    Global.CANVAS_WIDTH - 140 - Global.offsetX,
    70 - Global.offsetY
  );
}
