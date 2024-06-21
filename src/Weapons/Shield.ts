// Shield.ts
import { GameObject } from "../GameObject";
import { Global } from "../Global";
import { Enemy } from "../Enemy/Enemy";
import { checkCollisionEnemy } from "../Utils/Utils";
import { Sprite } from "../Sprites/Sprite";

export class Shield extends GameObject {
  public rotationSpeed: number;
  public damage: number;
  private radius: number;
  private angle: number;
  private player: GameObject;
  private width: number;
  private height: number;

  private collisionCooldown: number;
  private lastCollisionTime: Map<Enemy, number>;

  constructor(
    player: GameObject,
    rotationSpeed: number,
    damage: number,
    radius: number,
    collisionCooldown: number = 0.5 // Cooldown in seconds
  ) {
    super(player.X, player.Y);
    this.rotationSpeed = rotationSpeed;
    this.damage = damage;
    this.radius = radius;
    this.angle = 0;
    this.player = player;
    this.width = radius / 1.2;
    this.height = radius / 1.2;
    this.collisionCooldown = collisionCooldown;
    this.lastCollisionTime = new Map<Enemy, number>();
  }

  update(deltaTime: number, enemies: Enemy[]) {
    // Update the angle and position of the shield
    this.angle += this.rotationSpeed * deltaTime * 0.1;
    if (this.angle >= 360) {
      this.angle -= 360;
    }
    const radians = (this.angle * Math.PI) / 180;
    this.X = this.player.X + this.radius * Math.cos(radians);
    this.Y = this.player.Y + this.radius * Math.sin(radians);

    // Get the current time
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check collision with enemies
    enemies.forEach((enemy) => {
      if (checkCollisionEnemy(this, enemy)) {
        const lastHitTime = this.lastCollisionTime.get(enemy) || 0;
        if (currentTime - lastHitTime >= this.collisionCooldown) {
          this.lastCollisionTime.set(enemy, currentTime);
          enemy.takeDamage(this.damage);
        }
      }
    });
  }

  draw(sprite: Sprite) {
    const ctx = Global.CTX;
    ctx.save();
    ctx.translate(this.X, this.Y);
    ctx.drawImage(
      sprite.spriteSheet,
      0,
      450,
      40,
      30,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
