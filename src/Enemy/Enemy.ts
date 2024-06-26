import { GameObject } from "../GameObject";
import { Global } from "../Global";
import { Sprite } from "../Sprites/Sprite";
import { Player } from "../Player/Player";
import { checkCollisionPlayer } from "../Utils/Utils";
import { Particle } from "../Elements/Particles";
import { Currency } from "../Elements/Currency";
import { soundManager } from "../Sound/SoundManager";

// Class to create enemy objects
export class Enemy extends GameObject {
  //sprite properties
  public frameWidth: number;
  public frameHeight: number;
  private sourceX: number;
  private sourceY: number;
  private enemyScale: number;

  //animation properties
  private totalFrames: number;
  private currentFrame: number;
  private frameSpeed: number;
  private direction: string;
  private lastAnimationFrameTime: number | null;

  //movement properties
  private speed: number;

  //reference to player object
  private player: Player;

  //gameplay properties
  private damage: number;
  public health: number;

  //arrays
  private particles: Particle[] = [];
  private enemies: Enemy[];

  //damage text properties
  private damageTexts: {
    x: number;
    y: number;
    damage: number;
    alpha: number;
  }[];

  constructor(
    x: number,
    y: number,
    sourceY: number,
    frameWidth: number,
    frameHeight: number,
    health: number,
    speed: number,
    player: Player,
    enemies: Enemy[]
  ) {
    super(x, y);

    //set sprite properties
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sourceX = 0;
    this.sourceY = sourceY;

    //set animation properties
    this.totalFrames = 3;
    this.currentFrame = 0;
    this.frameSpeed = 150;
    this.direction = "right";
    this.lastAnimationFrameTime = null;
    this.enemyScale = 1.7;

    //set movement properties
    this.speed = speed;

    //set gameplay peoperties
    this.health = health;
    this.damage = 10;

    //set references
    this.player = player;
    this.enemies = enemies;

    //initialize arrays
    this.particles = [];
    this.damageTexts = [];
  }

  // Function to update the enemy's position and health
  enemyUpdate(deltaTime: number, timestamp: number, currencies: Currency[]) {

    // remove the enemy from array if health is 0
    if (this.health <= 0) {
      for (let enemy of this.enemies) {
        if (enemy === this) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      }
      
      // Drop a coin after death
      this.die(currencies);
    }

    // Calculate the direction towards the player
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

    // Update the direction based on movement
    if (dx < 0) {
      this.direction = "left";
    } else if (dx > 0) {
      this.direction = "right";
    }

    // Check if the enemy is close enough to damage the player
    if (checkCollisionPlayer(this, this.player)) {
      this.X = this.player.X + 100 * (dx < 0 ? 1 : -1);
      this.player.takeDamage(this.damage, timestamp);
      this.generateBloodParticles(this.player.X, this.player.Y);
    }

    // Update particles
    this.particles = this.particles.filter((p) => p.isAlive());
    this.particles.forEach((p) => p.update(deltaTime));

    // Update damage texts
    this.damageTexts = this.damageTexts.filter((dt) => dt.alpha > 0);
    this.damageTexts.forEach((dt) => (dt.alpha -= deltaTime / 1000));
  }

  // Function to generate blood particles when the enemy hits the player
  generateBloodParticles(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  // Function to decrease the enemy's health when hit by the player
  takeDamage(amount: number) {
    soundManager.playSFX("damage");
    this.health -= amount;
    this.damageTexts.push({ x: this.X, y: this.Y, damage: amount, alpha: 1 });
  }

  // Function to drop a coin when the enemy dies
  die(currencies: Currency[]) {
    Global.SCORE += 1;
    localStorage.setItem("score", Global.SCORE.toString());
    const diamond = new Currency(this.X, this.Y, this.player, currencies);
    currencies.push(diamond);
  }

  // Function to update the enemy's animation
  enemyAnimationUpdate(timestamp: number) {
    if (!this.lastAnimationFrameTime) {
      this.lastAnimationFrameTime = timestamp;
    }

    const animationDeltaTime = timestamp - this.lastAnimationFrameTime;
    if (animationDeltaTime > this.frameSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastAnimationFrameTime = timestamp;
    }
  }

  // Function to draw the enemy on the canvas
  enemyDraw(sprite: Sprite) {
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
        this.frameWidth * this.enemyScale,
        this.frameHeight * this.enemyScale
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
        this.frameWidth * this.enemyScale,
        this.frameHeight * this.enemyScale
      );
    }

    Global.CTX.restore();

    // Draw particles
    this.particles.forEach((p) => p.draw());

    // Draw damage texts
    Global.CTX.font = "40px Arial";
    Global.CTX.fillStyle = "white";
    this.damageTexts.forEach((dt) => {
      Global.CTX.globalAlpha = dt.alpha;
      Global.CTX.fillText(dt.damage.toString(), dt.x, dt.y);
      Global.CTX.globalAlpha = 1;
    });
  }
}
