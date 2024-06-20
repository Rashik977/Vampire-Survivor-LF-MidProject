// Bullet.ts
import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Sprite } from "./Sprite";
import { checkCollisionEnemy } from "./Utils";

export class Bullet extends GameObject {
  private speed: number;
  private direction: { x: number; y: number };
  public width: number;
  public height: number;
  public static damage: number = 20;
  private projectiles: Bullet[];

  private rotationAngle: number;

  constructor(
    x: number,
    y: number,
    speed: number,
    direction: { x: number; y: number },
    width: number,
    height: number,
    projectiles: Bullet[]
  ) {
    super(x, y);
    this.speed = speed;
    this.direction = direction;
    this.width = width;
    this.height = height;
    this.projectiles = projectiles;
    this.rotationAngle = 0; // Initialize rotation angle
  }

  update(deltaTime: number, enemies: Enemy[]) {
    this.X += this.direction.x * this.speed * deltaTime;
    this.Y += this.direction.y * this.speed * deltaTime;

    this.rotationAngle += 0.1; // Update rotation angle

    // Check collision with enemies
    enemies.forEach((enemy) => {
      if (checkCollisionEnemy(this, enemy)) {
        this.projectiles.splice(this.projectiles.indexOf(this), 1);
        enemy.takeDamage(Bullet.damage);
      }
    });
  }

  draw(sprite: Sprite) {
    const ctx = Global.CTX;
    ctx.save(); // Save the current state
    ctx.translate(this.X + this.width, this.Y + this.height); // Move to the center of the axe
    ctx.rotate(this.rotationAngle); // Rotate the canvas
    ctx.drawImage(
      sprite.spriteSheet,
      0,
      420,
      40,
      30,
      -this.width, // Draw the image centered
      -this.height,
      this.width * 2,
      this.height * 2
    );
    ctx.restore(); // Restore the state
  }

  isOutOfFrame() {
    return (
      this.X < -Global.offsetX ||
      this.X > Global.CANVAS_WIDTH - Global.offsetX ||
      this.Y < -Global.offsetY ||
      this.Y > Global.CANVAS_HEIGHT - Global.offsetY
    );
  }
}
