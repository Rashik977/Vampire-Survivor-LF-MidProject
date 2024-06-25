import { Global } from "../Global";

// function to display the death counter on the canvas
export function deathCounter(score: number) {
  Global.CTX.fillStyle = "white";
  Global.CTX.font = "20px Gothic A1";
  Global.CTX.letterSpacing = "3px";

  const skullEmoji = "💀";

  Global.CTX.fillText(
    `${skullEmoji}: ${score}`,
    Global.CANVAS_WIDTH - 140 - Global.offsetX,
    70 - Global.offsetY
  );
}
