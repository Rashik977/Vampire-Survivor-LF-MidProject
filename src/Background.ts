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
      (-Global.CANVAS_WIDTH * 4) / 2,
      (-Global.CANVAS_HEIGHT * 4) / 2,
      Global.CANVAS_WIDTH * 5,
      Global.CANVAS_HEIGHT * 5
    );
  }
}
