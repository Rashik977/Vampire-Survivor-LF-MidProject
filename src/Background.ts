import { GameObject } from "./GameObject";
import { Global } from "./Global";

export class Background extends GameObject {
  private image: HTMLImageElement;
  constructor(x: number, y: number, src: string) {
    super(x, y);
    this.image = new Image();
    this.image.src = src;
  }
  draw() {
    Global.CTX.drawImage(
      this.image,
      this.X,
      this.Y,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );
  }
}
