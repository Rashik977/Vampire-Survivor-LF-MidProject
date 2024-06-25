import { Global } from "../Global";

// Class to display the game over screen
export class GameOver {
  private gameOverImage: HTMLImageElement;

  constructor(src: string) {
    this.gameOverImage = new Image();
    this.gameOverImage.src = src;
  }

  draw() {
    Global.CTX.save();
    Global.CTX.drawImage(
      this.gameOverImage,
      Global.CANVAS_WIDTH / 2 - this.gameOverImage.width / 2 - Global.offsetX,
      Global.CANVAS_HEIGHT / 2 - this.gameOverImage.height / 2 - Global.offsetY
    );
    Global.CTX.fillStyle = "white";
    Global.CTX.font = "20px Arial";
    Global.CTX.fillText(
      "Press Enter to restart",
      Global.CANVAS_WIDTH / 2 - 135 - Global.offsetX,
      Global.CANVAS_HEIGHT / 2 + 60 - Global.offsetY
    );
    Global.CTX.restore();
  }
}
