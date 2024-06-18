import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Player } from "./Player";

export class Currency extends GameObject {
  private player: Player;
  private speed: number;
  private collected: boolean;
  private currencies: Currency[];

  constructor(x: number, y: number, player: Player, currencies: Currency[]) {
    super(x, y);
    this.player = player;
    this.speed = 0.1;
    this.collected = false;
    this.currencies = currencies;
  }

  update(deltaTime: number) {
    if (this.collected) {
      return;
    }

    // Check if player is near
    const distance = Math.sqrt(
      (this.player.X - this.X) ** 2 + (this.player.Y - this.Y) ** 2
    );
    if (distance < 50) {
      this.collected = true;
    }

    // Animate towards player if collected
    if (this.collected) {
      for (const currency of this.currencies) {
        if (currency === this) {
          this.currencies.splice(this.currencies.indexOf(currency), 1);
          this.player.collectDiamond();
        }
      }

      const dx = this.player.X - this.X;
      const dy = this.player.Y - this.Y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length > 0) {
        this.X += (dx / length) * this.speed * deltaTime;
        this.Y += (dy / length) * this.speed * deltaTime;
      }

      // Check if reached player
      if (distance < 10) {
        this.player.collectDiamond();
        return false; // Indicate to remove from array
      }
    }

    return true; // Indicate to keep in array
  }

  draw() {
    Global.CTX.fillStyle = "gold";
    Global.CTX.fillRect(this.X - 5, this.Y - 5, 10, 10);
  }
}
