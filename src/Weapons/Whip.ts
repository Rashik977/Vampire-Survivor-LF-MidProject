import { GameObject } from "../GameObject";
import { Global } from "../Global";

export class Whip extends GameObject {
  draw(
    isAttacking: boolean,
    direction: string,
    sprite: any,
    frameWidth: number,
    frameHeight: number,
    playerScale: number,
    whipLength: number
  ) {
    if (isAttacking && direction === "left") {
      Global.CTX.restore(); // Restore the Global.CANVAS state
      Global.CTX.drawImage(
        sprite.spriteSheet,
        0,
        380,
        frameWidth,
        20, // Source rectangle
        this.X - whipLength - 15,
        this.Y - frameHeight / 2, // Destination rectangle
        frameWidth * playerScale,
        20 * playerScale
      );
    }

    if (isAttacking && direction === "right") {
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        0,
        380,
        frameWidth,
        20, // Source rectangle
        -(this.X + frameWidth * 2.5),
        this.Y - frameHeight / 2, // Destination rectangle (negated x to flip)
        frameWidth * playerScale,
        20 * playerScale
      );
    }
  }
}
