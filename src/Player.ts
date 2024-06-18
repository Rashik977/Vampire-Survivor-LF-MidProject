import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Sprite } from "./Sprite";
import { Enemy } from "./Enemy";
import { checkCollision } from "./Utils";

export class Player extends GameObject {
  public frameWidth: number; // Width of a single frame
  public frameHeight: number; // Height of a single frame
  private totalFrames: number; // Total number of frames in the animation
  private currentFrame: number; // Index of the current frame
  private frameSpeed: number; // Speed of frame change in milliseconds
  private direction: string; // Possible values: 'right', 'left'
  private speed: number;
  private lastAnimationFrameTime: number | null;

  private sourceX: number;
  private sourceY: number;
  private playerScale: number;

  private health: number;
  private maxHealth: number;

  private damage: number;
  private damageCooldown: number;
  private lastDamageTime: number;

  private lastAttackTime: number | null; // For cooldown management
  private attackCooldown: number; // Cooldown duration in milliseconds
  private isAttacking: boolean; // To handle attack state
  private whipLength: number; // Length of the whip
  private enemies: Enemy[]; // Reference to the enemies

  private gameOverImage: HTMLImageElement;

  constructor(x: number, y: number, playerIndex: number, enemies: Enemy[]) {
    super(x, y);
    this.frameWidth = 37;
    this.frameHeight = 37;
    this.totalFrames = 3;
    this.currentFrame = 0;
    this.frameSpeed = 200;
    this.direction = "right";
    this.lastAnimationFrameTime = null;
    this.speed = 0.04;

    this.sourceX = 0;
    this.sourceY = playerIndex; // Assuming all frames are in a single row
    this.playerScale = 1.7; // Scale the player sprite

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.damageCooldown = 1000; // 1 second cooldown between damage
    this.lastDamageTime = 0;

    this.lastAttackTime = null;
    this.attackCooldown = 1000; // 1 second cooldown
    this.isAttacking = false;
    this.whipLength = 80; // Length of the whip
    this.enemies = enemies; // Reference to the enemies

    this.damage = 10; // Damage amount

    this.gameOverImage = new Image();
    this.gameOverImage.src = "gameOver.png";
  }

  takeDamage(amount: number, timestamp: number) {
    if (timestamp - this.lastDamageTime > this.damageCooldown) {
      this.health -= amount;
      this.lastDamageTime = timestamp;
      this.health = Math.max(this.health, 0); // Ensure health doesn't go below 0
    }
  }

  playerUpdate(deltaTime: number, timestamp: number, keys: any) {
    let dx = 0;
    let dy = 0;

    if (keys.left) {
      dx -= 1;
      this.direction = "left";
    }
    if (keys.right) {
      dx += 1;
      this.direction = "right";
    }
    if (keys.up) {
      dy -= 1;
    }
    if (keys.down) {
      dy += 1;
    }

    // Normalize the movement to ensure consistent speed in all directions
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx = (dx / length) * this.speed * deltaTime;
      dy = (dy / length) * this.speed * deltaTime;
    }

    this.X += dx;
    this.Y += dy;

    // Handle attack
    if (
      keys.attack &&
      !this.isAttacking &&
      (!this.lastAttackTime ||
        timestamp - this.lastAttackTime >= this.attackCooldown)
    ) {
      this.isAttacking = true;
      this.lastAttackTime = timestamp;
      this.performAttack();
    }

    if (
      this.isAttacking &&
      (!this.lastAttackTime ||
        timestamp - this.lastAttackTime >= this.attackCooldown / 2)
    ) {
      this.isAttacking = false;
    }
  }

  performAttack() {
    const whipEndX =
      this.direction === "right"
        ? this.X + this.whipLength
        : this.X - this.whipLength;
    const whipEndY = this.Y;

    this.enemies.forEach((enemy) => {
      if (
        checkCollision(
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
    });
  }

  playerAnimationUpdate(timestamp: number, isMoving: boolean) {
    if (!this.lastAnimationFrameTime) {
      this.lastAnimationFrameTime = timestamp;
    }

    if (isMoving) {
      //
      const animationDeltaTime = timestamp - this.lastAnimationFrameTime;
      if (animationDeltaTime > this.frameSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.lastAnimationFrameTime = timestamp;
      }
    } else {
      this.currentFrame = 0; // Reset to the first frame when not moving
    }
  }

  playerDraw(sprite: Sprite) {
    if (this.health <= 0) {
      console.log("Game Over");
      Global.CTX.drawImage(
        this.gameOverImage,
        Global.CANVAS_WIDTH / 2 - this.gameOverImage.width / 2,
        Global.CANVAS_HEIGHT / 2 - this.gameOverImage.height / 2
      );
      Global.CTX.fillStyle = "white";
      Global.CTX.font = "20px Arial";
      Global.CTX.fillText(
        "Press Enter to restart",
        Global.CANVAS_WIDTH / 2 - 100,
        Global.CANVAS_HEIGHT / 2 + 60
      );
      Global.GAMEOVER = true;
      Global.PAUSE = true;
      return;
    }
    this.sourceX = this.currentFrame * this.frameWidth;
    // Global.CTX.save(); // Save the current state of the canvas

    // Apply red tint filter if the player is damaged
    // if (this.isDamaged) {
    //   Global.CTX.filter = "hue-rotate(-50deg) saturate(200%)";
    // } else {
    //   Global.CTX.filter = "none";
    // }
    // Global.CTX.restore(); // Restore the Global.CANVAS state
    Global.CTX.save(); // Save the current state of the canvas

    if (this.direction === "left") {
      // Flip the sprite horizontally
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        this.frameWidth,
        this.frameHeight, // Source rectangle
        -(this.X + this.frameWidth / 2),
        this.Y - this.frameHeight / 2, // Destination rectangle (negated x to flip)
        this.frameWidth * this.playerScale,
        this.frameHeight * this.playerScale
      );
    } else {
      // Draw normally
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        this.frameWidth,
        this.frameHeight, // Source rectangle
        this.X - this.frameWidth / 2,
        this.Y - this.frameHeight / 2, // Destination rectangle
        this.frameWidth * this.playerScale,
        this.frameHeight * this.playerScale
      );
    }

    if (this.isAttacking) {
      Global.CTX.restore(); // Restore the Global.CANVAS state
      Global.CTX.strokeStyle = "yellow";
      Global.CTX.lineWidth = 2;
      Global.CTX.beginPath();
      Global.CTX.moveTo(this.X, this.Y);
      Global.CTX.lineTo(
        this.direction === "right"
          ? this.X + this.whipLength
          : this.X - this.whipLength,
        this.Y
      );
      Global.CTX.stroke();
    }

    Global.CTX.restore(); // Restore the Global.CANVAS state
    // Draw the health bar
    this.drawHealthBar();
  }

  drawCollisionBorder() {
    Global.CTX.strokeStyle = "red";
    Global.CTX.lineWidth = 2;
    Global.CTX.strokeRect(
      this.X - this.frameWidth / 2,
      this.Y - this.frameHeight / 2,
      this.frameWidth,
      this.frameHeight
    );
  }

  drawHealthBar() {
    const barWidth = 50;
    const barHeight = 5;
    const x = this.X - barWidth / 2;
    const y = this.Y + this.frameHeight + 10;

    Global.CTX.fillStyle = "black";
    Global.CTX.fillRect(x, y, barWidth + 2, barHeight + 2);

    Global.CTX.fillStyle = "red";
    Global.CTX.fillRect(
      x,
      y,
      (this.health / this.maxHealth) * barWidth,
      barHeight
    );
  }
}
