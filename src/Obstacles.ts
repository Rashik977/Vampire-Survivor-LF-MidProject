import { Global } from "./Global";
import { Sprite } from "./Sprite";
import { GameObject } from "./GameObject";

export class Obstacle extends GameObject {
  public width: number;
  public height: number;
  private sprite: Sprite;
  private spriteX: number;
  private spriteY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    sprite: Sprite,
    spriteX: number,
    spriteY: number
  ) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.spriteX = spriteX;
    this.spriteY = spriteY;
  }

  draw() {
    Global.CTX.drawImage(
      this.sprite.spriteSheet,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height, // Source
      this.X,
      this.Y, // Destination
      this.width * 2,
      this.height * 2 // Destination dimensions
    );
  }
}
