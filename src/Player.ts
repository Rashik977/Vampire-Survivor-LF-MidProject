import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Sprite } from "./Sprite";
import { Enemy } from "./Enemy";
import { checkCollisionPlayer, normalize } from "./Utils";
import { Upgrade } from "./Upgrade";
import { soundManager } from "./SoundManager";
import { Bullet } from "./Bullets";
import { Shield } from "./Shield";

export class Player extends GameObject {
  public frameWidth: number; // Width of a single frame
  public frameHeight: number; // Height of a single frame
  private totalFrames: number; // Total number of frames in the animation
  private currentFrame: number; // Index of the current frame
  private frameSpeed: number; // Speed of frame change in milliseconds
  public direction: string; // Possible values: 'right', 'left'
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

  private collectedDiamonds: number;
  public level: number;

  public coinAttractionRange: number;

  private upgradeChoices: Upgrade[] | null = null;
  private upgradeChoicePositions: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];

  private hoveredChoiceIndex: number | null = null;

  // public isCollidingWithWall: boolean = false;
  public isCollidingWithWallX: boolean = false;
  public isCollidingWithWallY: boolean = false;

  private gameLoop: any;

  public static ownGun: boolean = false;
  public static ownBible: boolean = false;

  private projectiles: Bullet[] = [];
  private projectileCooldown: number = 1000; // 0.5 second cooldown
  private lastProjectileTime: number | null = null;

  private shield: Shield = new Shield(this, 2, 5, 80);

  constructor(
    x: number,
    y: number,
    playerIndex: number,
    enemies: Enemy[],
    gameLoop: any
  ) {
    super(x, y);
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

    this.collectedDiamonds = 0;
    this.level = 1;

    this.coinAttractionRange = 60;

    this.gameLoop = gameLoop;
  }

  takeDamage(amount: number, timestamp: number) {
    if (timestamp - this.lastDamageTime > this.damageCooldown) {
      this.health -= amount;
      soundManager.playSFX("take_damage");
      this.lastDamageTime = timestamp;
      this.health = Math.max(this.health, 0); // Ensure health doesn't go below 0
    }
  }

  collectDiamond() {
    this.collectedDiamonds += 1;
    this.checkLevelUp();
    soundManager.playSFX("collect");
  }

  checkLevelUp() {
    while (this.collectedDiamonds >= this.level * 5) {
      this.collectedDiamonds = 0;
      this.level += 1;
      soundManager.playSFX("level_up");
      this.promptUpgradeChoices();
    }
  }

  promptUpgradeChoices() {
    Global.PAUSE = true;
    Global.UPGRADE_CHOICES = true; // Set upgrade choice state
    this.upgradeChoices = Upgrade.getRandomUpgrades();
    this.drawUpgradeChoices();

    // Add mouse event listeners for selection and hover
    Global.CANVAS.addEventListener("click", this.handleUpgradeSelection);
    Global.CANVAS.addEventListener("mousemove", this.handleUpgradeHover);
  }

  drawUpgradeChoices() {
    if (!this.upgradeChoices) return;
    Global.CTX.clearRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );
    Global.CTX.fillStyle = "rgba(0, 0, 0, 0.7)";
    Global.CTX.fillRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );

    Global.CTX.fillStyle = "white";
    Global.CTX.font = "20px Arial";

    this.upgradeChoicePositions = [];
    const choiceHeight = 100;
    const spacing =
      (Global.CANVAS_HEIGHT - this.upgradeChoices.length * choiceHeight) /
      (this.upgradeChoices.length + 1);

    this.upgradeChoices.forEach((upgrade, index) => {
      const y = spacing + index * (choiceHeight + spacing) - Global.offsetY;
      const x = Global.CANVAS_WIDTH / 2 - 150 - Global.offsetX;
      const width = 300;
      const height = choiceHeight;

      // Store the position and size of the upgrade choice
      this.upgradeChoicePositions.push({ x, y, width, height });

      // Draw the border
      Global.CTX.strokeStyle = "black";
      Global.CTX.lineWidth = 3;
      Global.CTX.strokeRect(x, y, width, height);

      // Change the color if hovered
      if (index === this.hoveredChoiceIndex) {
        Global.CTX.fillStyle = "lightgrey";
        Global.CTX.fillRect(x, y, width, height);
        Global.CANVAS.style.cursor = "pointer";
      } else {
        Global.CTX.fillStyle = "white";
        Global.CANVAS.style.cursor = "default";
      }

      // Draw the text
      Global.CTX.fillStyle = "black";
      Global.CTX.fillText(upgrade.name, x + 10, y + 30);
      Global.CTX.fillText(upgrade.description, x + 10, y + 60);
    });
  }

  handleUpgradeHover = (event: MouseEvent) => {
    const rect = Global.CANVAS.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - Global.offsetX;
    const mouseY = event.clientY - rect.top - Global.offsetY;

    let hoveredIndex: number | null = null;

    this.upgradeChoicePositions.forEach((position, index) => {
      if (
        mouseX >= position.x &&
        mouseX <= position.x + position.width &&
        mouseY >= position.y &&
        mouseY <= position.y + position.height
      ) {
        hoveredIndex = index;
      }
    });

    if (this.hoveredChoiceIndex !== hoveredIndex) {
      this.hoveredChoiceIndex = hoveredIndex;
      this.drawUpgradeChoices();
    }
  };

  handleUpgradeSelection = (event: MouseEvent) => {
    if (!this.upgradeChoices) return;

    const rect = Global.CANVAS.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - Global.offsetX;
    const mouseY = event.clientY - rect.top - Global.offsetY;

    this.upgradeChoicePositions.forEach((position, index) => {
      if (
        mouseX >= position.x &&
        mouseX <= position.x + position.width &&
        mouseY >= position.y &&
        mouseY <= position.y + position.height
      ) {
        if (this.upgradeChoices) {
          const selectedUpgrade = this.upgradeChoices[index];
          this.applyUpgrade(selectedUpgrade);
          this.upgradeChoices = null;
          Global.PAUSE = false;
          Global.UPGRADE_CHOICES = false; // Reset upgrade choice state
          requestAnimationFrame(this.gameLoop);
          Global.CANVAS.removeEventListener(
            "click",
            this.handleUpgradeSelection
          );
          Global.CANVAS.removeEventListener(
            "mousemove",
            this.handleUpgradeHover
          );
        }
      }
    });
  };

  applyUpgrade(upgrade: Upgrade) {
    switch (upgrade.type) {
      case "speed":
        this.speed += 0.02;
        break;
      case "maxHealth":
        this.health = this.maxHealth;
        break;
      case "coinAttraction":
        this.coinAttractionRange += 10;
        break;
      case "gun":
        Player.ownGun = true;
        break;
      case "gun upgrade":
        this.projectileCooldown -= 100;
        Bullet.damage += 10;
        break;
      case "whip upgrade":
        this.damage += 5;
        this.damageCooldown -= 100;
        break;
      case "shield":
        Player.ownBible = true;
        break;
      case "shield upgrade":
        this.shield.rotationSpeed += 0.1;
        this.shield.damage += 3;
        break;
    }
  }

  drawLevelProgressBar() {
    const progressBarWidth = Global.CANVAS_WIDTH - 40;
    const progressBarHeight = 30;
    const progressBarX = 20 - Global.offsetX;
    const progressBarY = 10 - Global.offsetY;
    const requiredDiamondsForNextLevel = this.level * 5;
    const progressPercentage =
      (this.collectedDiamonds % requiredDiamondsForNextLevel) /
      requiredDiamondsForNextLevel;

    // Draw the progress bar background
    Global.CTX.fillStyle = "gray";
    Global.CTX.fillRect(
      progressBarX,
      progressBarY,
      progressBarWidth,
      progressBarHeight
    );

    // Draw the filled part of the progress bar
    Global.CTX.fillStyle = "green";
    Global.CTX.fillRect(
      progressBarX,
      progressBarY,
      progressBarWidth * progressPercentage,
      progressBarHeight
    );

    // Draw the level text
    Global.CTX.fillStyle = "white";
    Global.CTX.font = "20px Arial";
    Global.CTX.fillText(
      `Level: ${this.level}`,
      progressBarX + progressBarWidth / 2 - 30,
      progressBarY + progressBarHeight / 2 + 7
    );
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
      new Bullet(this.X, this.Y, speed, direction, 40, 30, this.projectiles)
    );
  }

  performAttack() {
    soundManager.playSFX("whip");
    const whipEndX =
      this.direction === "right"
        ? this.X + this.whipLength
        : this.X - this.whipLength;
    const whipEndY = this.Y;

    this.enemies.forEach((enemy) => {
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
    if (Player.ownBible) this.shield.draw(sprite);
    if (this.health <= 0) {
      soundManager.playSFX("gameOver");
      soundManager.music.pause();
      console.log("Game Over");
      Global.CTX.drawImage(
        this.gameOverImage,
        Global.CANVAS_WIDTH / 2 - this.gameOverImage.width / 2 - Global.offsetX,
        Global.CANVAS_HEIGHT / 2 -
          this.gameOverImage.height / 2 -
          Global.offsetY
      );
      Global.CTX.fillStyle = "white";
      Global.CTX.font = "20px Arial";
      Global.CTX.fillText(
        "Press Enter to restart",
        Global.CANVAS_WIDTH / 2 - 100 - Global.offsetX,
        Global.CANVAS_HEIGHT / 2 + 60 - Global.offsetY
      );
      Global.GAMEOVER = true;
      Global.PAUSE = true;
      return;
    }
    this.sourceX = this.currentFrame * this.frameWidth;
    Global.CTX.save(); // Save the current state of the canvas

    // if (this.isDamaged) {
    //   Global.CTX.filter = "hue-rotate(-50deg) saturate(200%)";
    // } else {
    //   Global.CTX.filter = "none";
    // }
    Global.CTX.restore(); // Restore the Global.CANVAS state
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

    if (this.isAttacking && this.direction === "left") {
      Global.CTX.restore(); // Restore the Global.CANVAS state
      Global.CTX.drawImage(
        sprite.spriteSheet,
        0,
        380,
        this.frameWidth,
        20, // Source rectangle
        this.X - this.whipLength - 15,
        this.Y - this.frameHeight / 2, // Destination rectangle
        this.frameWidth * this.playerScale,
        20 * this.playerScale
      );
    }

    if (this.isAttacking && this.direction === "right") {
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        0,
        380,
        this.frameWidth,
        20, // Source rectangle
        -(this.X + this.frameWidth * 2.5),
        this.Y - this.frameHeight / 2, // Destination rectangle (negated x to flip)
        this.frameWidth * this.playerScale,
        20 * this.playerScale
      );
    }

    Global.CTX.restore(); // Restore the Global.CANVAS state
    // Draw the health bar
    // this.drawDiamondsCounter();
    this.drawLevelProgressBar();
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
