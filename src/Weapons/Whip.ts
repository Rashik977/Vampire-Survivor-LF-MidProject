import { Enemy } from "../Enemy/Enemy";
import { GameObject } from "../GameObject";
import { Global } from "../Global";
import { checkCollisionPlayer } from "../Utils/Utils";

export class Whip extends GameObject {
  public whipLength: number;
  public damage: number;
  public damageCooldown: number;
  public attackCooldown: number;
  private sourceX: number;
  private sourceY: number;
  private frameWidth: number = 37;
  private frameHeight: number = 37;
  private player: GameObject;

  constructor(
    player: GameObject,
    damage: number,
    damageCooldown: number,
    whipLength: number,
    attackCooldown: number
  ) {
    super(player.X, player.Y);
    this.whipLength = 50;
    this.sourceX = 0;
    this.sourceY = 380;
    this.damage = damage;
    this.damageCooldown = damageCooldown;
    this.player = player;
    this.whipLength = whipLength;
    this.attackCooldown = attackCooldown;
  }

  update() {
    this.X = this.player.X;
    this.Y = this.player.Y;
  }

  enemyHit(whipEndX: number, whipEndY: number, enemy: Enemy) {
    if (
      checkCollisionPlayer(
        {
          X: whipEndX,
          Y: whipEndY,
          frameHeight: this.frameHeight,
          frameWidth: this.frameWidth,
        },
        enemy
      )
    ) {
      enemy.takeDamage(this.damage);
    }
  }

  draw(
    isAttacking: boolean,
    direction: string,
    sprite: any,
    frameWidth: number,
    frameHeight: number,
    playerScale: number
  ) {
    if (isAttacking && direction === "left") {
      Global.CTX.restore(); // Restore the Global.CANVAS state
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        frameWidth,
        20, // Source rectangle
        this.X - this.whipLength - 20,
        this.Y - frameHeight / 2, // Destination rectangle
        frameWidth * playerScale,
        20 * playerScale
      );
    }

    if (isAttacking && direction === "right") {
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
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
