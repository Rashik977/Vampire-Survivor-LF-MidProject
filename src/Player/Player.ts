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

// Class to create player object
export class Player extends GameObject {
  //sprite properties
  public frameWidth: number;
  public frameHeight: number;
  private sourceX: number;
  private sourceY: number;
  private playerScale: number;

  //animation properties
  private totalFrames: number;
  private currentFrame: number;
  private frameSpeed: number;
  private lastAnimationFrameTime: number | null;
  public direction: string;

  //Gameplay properties
  public speed: number;
  public health: number;
  public maxHealth: number;

  //attack properties
  private lastDamageTime: number;
  private lastAttackTime: number | null;
  private isAttacking: boolean;

  //coin properties and level
  public collectedDiamonds: number;
  public level: number;
  public coinAttractionRange: number;

  //wall collision properties
  public isCollidingWithWallX: boolean = false;
  public isCollidingWithWallY: boolean = false;

  //static variables to check if player owns a weapon
  public static ownGun: boolean = false;
  public static ownBible: boolean = false;
  public static ownWhip: boolean = false;

  //arrays
  private enemies: Enemy[];
  private projectiles: Bullet[] = [];

  //bullet/axe properties
  public bulletDamage: number = 20;
  public projectileCooldown: number = 1000;
  private lastProjectileTime: number | null = null;

  //weapons objects
  public shield: Shield;
  public whip: Whip;

  //game over object
  private gameOver: GameOver;

  constructor(playerIndex: number, enemies: Enemy[], health: number) {
    super(Global.CANVAS_WIDTH / 2, Global.CANVAS_HEIGHT / 2);
    //set sprite properties
    this.frameWidth = 37;
    this.frameHeight = 37;
    this.totalFrames = 3;
    this.sourceX = 0;
    this.sourceY = playerIndex;
    this.playerScale = 2;

    //set animation properties
    this.currentFrame = 0;
    this.frameSpeed = 150;
    this.direction = "right";
    this.lastAnimationFrameTime = null;

    //set gameplay properties
    this.speed = 0.1;
    this.maxHealth = health;
    this.health = this.maxHealth;
    this.lastDamageTime = 0;

    //set attack properties
    this.lastAttackTime = null;
    this.isAttacking = false;

    //set coin properties and level
    this.collectedDiamonds = 0;
    this.coinAttractionRange = 60;
    this.level = 1;

    //set arrays
    this.enemies = enemies;

    //set weapons objects
    this.whip = new Whip(this, 10, 1000, 80, 1000);
    this.shield = new Shield(this, 2, 5, 80);

    //set game over object
    this.gameOver = new GameOver("UI/gameOver.png");
  }

  //function to update player health if player takes damage
  takeDamage(amount: number, timestamp: number) {
    soundManager.playSFX("take_damage");
    if (timestamp - this.lastDamageTime > this.whip.damageCooldown) {
      this.health -= amount;
      this.lastDamageTime = timestamp;

      // Ensure health doesn't go below 0
      this.health = Math.max(this.health, 0);
    }
  }

  // function to increse collected diamonds
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

  //function to fire bullets
  fireBullet() {
    soundManager.playSFX("gun");
    let direction = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    direction = normalize(direction);
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

  //function to attack with whip
  whipAttack() {
    console.log(this.whip.whipLength);
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
      this.currentFrame = 0;
    }
  }

  playerDraw(sprite: Sprite, elapsedTime: number) {
    // Draw bullets
    this.projectiles.forEach((bullet) => {
      bullet.draw(sprite);
    });

    //Draw bible
    if (Player.ownBible) this.shield.draw(sprite);

    // Game Over
    if (this.health <= 0) {
      if (elapsedTime > Global.HIGH_TIMER) {
        Global.HIGH_TIMER = elapsedTime;
        localStorage.setItem("highTimer", Global.HIGH_TIMER.toString());
      }
      soundManager.playSFX("gameOver");
      soundManager.music.pause();
      this.gameOver.draw();
      Global.GAMEOVER = true;
      Global.PAUSE = true;
      return;
    }

    this.sourceX = this.currentFrame * this.frameWidth;
    Global.CTX.save();

    if (this.direction === "left") {
      // Flip the sprite horizontally
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        this.frameWidth,
        this.frameHeight,
        -(this.X + this.frameWidth / 2),
        this.Y - this.frameHeight / 2,
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
        this.frameHeight,
        this.X - this.frameWidth / 2,
        this.Y - this.frameHeight / 2,
        this.frameWidth * this.playerScale,
        this.frameHeight * this.playerScale
      );
    }

    // Draw the whip
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

    Global.CTX.restore();

    // Draw the health bar
    drawLevelProgressBar(this);
    drawHealthBar(this);
  }
}
