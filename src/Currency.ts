import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Player } from "./Player";
import { Sprite } from "./Sprite";

export class Currency extends GameObject {
  private player: Player;
  private speed: number;
  private collecting: boolean;
  private currencies: Currency[];

  private sourceX: number;
  private sourceY: number;
  private frameWidth: number;
  private frameHeight: number;

  constructor(x: number, y: number, player: Player, currencies: Currency[]) {
    super(x, y);
    this.player = player;
    this.speed = 0.8;
    this.collecting = false;
    this.currencies = currencies;

    this.sourceX = 0;
    this.sourceY = 400;
    this.frameWidth = 24;
    this.frameHeight = 24;
  }

  update(deltaTime: number) {
    // Check if player is near
    const distance = Math.sqrt(
      (this.player.X - this.X) ** 2 + (this.player.Y - this.Y) ** 2
    );
    if (
      (distance < this.player.coinAttractionRange &&
        this.player.direction === "right") ||
      (distance < this.player.coinAttractionRange + 40 &&
        this.player.direction === "left")
    ) {
      this.collecting = true;
    }

    // Animate towards player if collecting
    if (this.collecting) {
      let dx = this.player.X - this.X;
      let dy = this.player.Y - this.Y;

      // Normalize the movement to ensure consistent speed in all directions
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length > 0) {
        dx = (dx / length) * this.speed * deltaTime;
        dy = (dy / length) * this.speed * deltaTime;
      }

      // Update the enemy's position
      this.X += dx;
      this.Y += dy;

      // Check if reached player
      if (distance < 10) {
        for (const currency of this.currencies) {
          if (currency === this) {
            this.currencies.splice(this.currencies.indexOf(currency), 1);
            this.player.collectDiamond();
          }
        }
      }
    }
  }

  draw(sprite: Sprite) {
    Global.CTX.drawImage(
      sprite.spriteSheet,
      this.sourceX,
      this.sourceY,
      this.frameWidth,
      this.frameHeight,
      this.X,
      this.Y,
      this.frameWidth * 2,
      this.frameHeight * 2
    );
  }
}
