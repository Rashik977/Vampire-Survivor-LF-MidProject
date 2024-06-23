import { GameObject } from "../GameObject";
import { Global } from "../Global";
import { Sprite } from "../Sprites/Sprite";
import { Enemy } from "../Enemy/Enemy";
import { normalize } from "../Utils/Utils";
import { soundManager } from "../Sound/SoundManager";
import { Bullet } from "../Weapons/Bullets";
import { Shield } from "../Weapons/Shield";
import { drawHealthBar } from "../Elements/healthBar";
import { GameOver } from "../Sprites/GameOver";
import { Whip } from "../Weapons/Whip";
import { drawLevelProgressBar } from "../Elements/levelProgressBar";

export class Player extends GameObject {
  public frameWidth: number; // Width of a single frame
  public frameHeight: number; // Height of a single frame
  private totalFrames: number; // Total number of frames in the animation
  private currentFrame: number; // Index of the current frame
  private frameSpeed: number; // Speed of frame change in milliseconds
  public direction: string; // Possible values: 'right', 'left'
  public speed: number;
  private lastAnimationFrameTime: number | null;

  private sourceX: number;
  private sourceY: number;
  private playerScale: number;

  public health: number;
  public maxHealth: number;

  private lastDamageTime: number;

  private lastAttackTime: number | null; // For cooldown management
  private isAttacking: boolean; // To handle attack state
  private enemies: Enemy[]; // Reference to the enemies

  public collectedDiamonds: number;
  public level: number;

  public coinAttractionRange: number;

  // public isCollidingWithWall: boolean = false;
  public isCollidingWithWallX: boolean = false;
  public isCollidingWithWallY: boolean = false;

  public static ownGun: boolean = false;
  public static ownBible: boolean = false;
  public static ownWhip: boolean = false;

  public bulletDamage: number = 20;

  private projectiles: Bullet[] = [];
  public projectileCooldown: number = 1000; // 0.5 second cooldown
  private lastProjectileTime: number | null = null;

  public shield: Shield;
  public whip: Whip;

  private gameOver: GameOver;

  constructor(playerIndex: number, enemies: Enemy[], health: number) {
    super(Global.CANVAS_WIDTH / 2, Global.CANVAS_HEIGHT / 2);
    this.frameWidth = 37;
    this.frameHeight = 37;
    this.totalFrames = 3;
    this.currentFrame = 0;
    this.frameSpeed = 150;
    this.direction = "right";
    this.lastAnimationFrameTime = null;
    this.speed = 0.1;

    this.sourceX = 0;
    this.sourceY = playerIndex; // Assuming all frames are in a single row
    this.playerScale = 2; // Scale the player sprite

    this.maxHealth = health;
    this.health = this.maxHealth;
    this.lastDamageTime = 0;

    this.lastAttackTime = null;
    this.isAttacking = false;
    this.enemies = enemies; // Reference to the enemies

    this.collectedDiamonds = 4;
    this.level = 1;

    this.coinAttractionRange = 60;

    this.gameOver = new GameOver("gameOver.png");
    this.whip = new Whip(this, 10, 1000, 80, 1000);
    this.shield = new Shield(this, 2, 5, 80);
  }

  takeDamage(amount: number, timestamp: number) {
    soundManager.playSFX("take_damage");
    if (timestamp - this.lastDamageTime > this.whip.damageCooldown) {
      this.health -= amount;
      this.lastDamageTime = timestamp;
      this.health = Math.max(this.health, 0); // Ensure health doesn't go below 0
    }
  }

  collectDiamond() {
    this.collectedDiamonds += 1;
    soundManager.playSFX("collect");
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

    if (Player.ownBible) this.shield.update(deltaTime, this.enemies);
    if (Player.ownWhip) this.whip.update();

    // Normalize the movement to ensure consistent speed in all directions
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx = (dx / length) * this.speed * deltaTime;
      dy = (dy / length) * this.speed * deltaTime;
      if (!this.isCollidingWithWallX) {
        Global.CTX.translate(-dx, 0);
        Global.offsetX -= dx;
      }
      if (!this.isCollidingWithWallY) {
        Global.CTX.translate(0, -dy);
        Global.offsetY -= dy;
      }
    }

    this.X += dx;
    this.Y += dy;

    this.isCollidingWithWallX = false;
    this.isCollidingWithWallY = false;
    // Check for collision with canvas boundaries
    if (this.X + Global.CANVAS_WIDTH / 0.7 - this.frameWidth < 0) {
      this.X = this.frameWidth - Global.CANVAS_WIDTH / 0.7;
      this.isCollidingWithWallX = true;
    }
    if (this.X + this.frameWidth > Global.CANVAS_WIDTH * 2.5) {
      this.X = Global.CANVAS_WIDTH * 2.5 - this.frameWidth;
      this.isCollidingWithWallX = true;
    }
    if (this.Y + Global.CANVAS_HEIGHT / 0.7 - this.frameHeight < 0) {
      this.Y = this.frameHeight - Global.CANVAS_HEIGHT / 0.7;
      this.isCollidingWithWallY = true;
    }
    if (this.Y + this.frameHeight > Global.CANVAS_HEIGHT * 2.5) {
      this.Y = Global.CANVAS_HEIGHT * 2.5 - this.frameHeight;
      this.isCollidingWithWallY = true;
    }

    // Handle attack
    if (
      Player.ownWhip &&
      !this.isAttacking &&
      (!this.lastAttackTime ||
        timestamp - this.lastAttackTime >= this.whip.attackCooldown)
    ) {
      this.isAttacking = true;
      this.lastAttackTime = timestamp;
      this.whipAttack();
    }

    if (
      Player.ownWhip &&
      this.isAttacking &&
      (!this.lastAttackTime ||
        timestamp - this.lastAttackTime >= this.whip.attackCooldown / 2)
    ) {
      this.isAttacking = false;
    }

    // Fire bullets at fixed intervals
    if (
      Player.ownGun &&
      (!this.lastProjectileTime ||
        timestamp - this.lastProjectileTime >= this.projectileCooldown)
    ) {
      this.fireBullet();
      this.lastProjectileTime = timestamp;
    }

    // Update bullets
    this.projectiles.forEach((bullet, index) => {
      bullet.update(deltaTime, this.enemies);
      if (bullet.isOutOfFrame()) {
        this.projectiles.splice(index, 1);
      }
    });
  }

  fireBullet() {
    soundManager.playSFX("gun");
    let direction = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    direction = normalize(direction); // Normalize the direction vector
    const speed = 0.6;
    this.projectiles.push(
      new Bullet(
        this.X,
        this.Y,
        speed,
        direction,
        40,
        30,
        this.projectiles,
        this.bulletDamage
      )
    );
  }

  whipAttack() {
    soundManager.playSFX("whip");
    const whipEndX =
      this.direction === "right"
        ? this.X + this.whip.whipLength
        : this.X - this.whip.whipLength;
    const whipEndY = this.Y;

    this.enemies.forEach((enemy) => {
      this.whip.enemyHit(whipEndX, whipEndY, enemy);
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
    // Draw bullets
    this.projectiles.forEach((bullet) => {
      bullet.draw(sprite);
    });

    //Draw bible
    if (Player.ownBible) this.shield.draw(sprite);

    // Game Over
    if (this.health <= 0) {
      soundManager.playSFX("gameOver");
      soundManager.music.pause();
      this.gameOver.draw();
      Global.GAMEOVER = true;
      Global.PAUSE = true;
      return;
    }

    this.sourceX = this.currentFrame * this.frameWidth;
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

    if (Player.ownWhip) {
      this.whip.draw(
        this.isAttacking,
        this.direction,
        sprite,
        40,
        20,
        this.playerScale
      );
    }

    Global.CTX.restore(); // Restore the Global.CANVAS state

    // Draw the health bar
    drawLevelProgressBar(this);
    drawHealthBar(this);
  }
}