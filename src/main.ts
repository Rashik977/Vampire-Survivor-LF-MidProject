import "./style.css";
import { Global } from "./Global";
import { Background } from "./Background";
import { Player } from "./Player";
import { Sprite } from "./Sprite";
import { KeyControls } from "./KeyControls";
import { Enemy } from "./Enemy";
import { Currency } from "./Currency";

Global.CANVAS.width = Global.CANVAS_WIDTH;
Global.CANVAS.height = Global.CANVAS_HEIGHT;
Global.CANVAS.style.border = `1px solid ${Global.CANVAS_BORDER_COLOR}`;

const enemies: Enemy[] = [];
const currencies: Currency[] = [];

const sprite = new Sprite("characters1.png", gameLoop);
const background = new Background(0, 0, "bg_forest.png");
const player = new Player(
  Global.CANVAS_WIDTH / 2,
  Global.CANVAS_HEIGHT / 2,
  0,
  enemies
);
const controlls = new KeyControls();

let lastFrameTime: number = 0;

// Enemy spawn variables
let elapsedSpawnTime = 0;
const minSpawnInterval = 2000; // Minimum spawn interval in milliseconds
const maxSpawnInterval = 5000; // Maximum spawn interval in milliseconds
let spawnInterval = getRandomSpawnInterval();

controlls.keydown(gameLoop);
controlls.keyup();

// Function to get a random spawn interval within the specified range
function getRandomSpawnInterval() {
  return (
    Math.random() * (maxSpawnInterval - minSpawnInterval) + minSpawnInterval
  );
}

// Function to spawn enemies at random positions outside the canvas
function spawnEnemy() {
  const side = Math.floor(Math.random() * 4); // Randomize the side (0: top, 1: right, 2: bottom, 3: left)
  let x: number = 0,
    y: number = 0;

  switch (side) {
    case 0: // Top
      x = Math.random() * Global.CANVAS_WIDTH;
      y = -50; // Spawn above the canvas
      break;
    case 1: // Right
      x = Global.CANVAS_WIDTH + 50; // Spawn to the right of the canvas
      y = Math.random() * Global.CANVAS_HEIGHT;
      break;
    case 2: // Bottom
      x = Math.random() * Global.CANVAS_WIDTH;
      y = Global.CANVAS_HEIGHT + 50; // Spawn below the canvas
      break;
    case 3: // Left
      x = -50; // Spawn to the left of the canvas
      y = Math.random() * Global.CANVAS_HEIGHT;
      break;
  }

  enemies.push(new Enemy(x, y, 220, player, enemies));
}

function gameLoop(timestamp: number) {
  if (Global.PAUSE) {
    if (Global.UPGRADE_CHOICES) {
      // If the player is choosing upgrades, do not show the pause message
      player.drawUpgradeChoices();
    } else if (!Global.GAMEOVER) {
      Global.CTX.fillStyle = "white";
      Global.CTX.font = "60px Arial";
      Global.CTX.fillText(
        "PAUSED",
        Global.CANVAS_WIDTH / 2 - 120,
        Global.CANVAS_HEIGHT / 2
      );
    }
    lastFrameTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  // Calculate the time elapsed since the last frame
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  // Update elapsed spawn time
  elapsedSpawnTime += deltaTime;

  // Check if it's time to spawn a new enemy
  if (elapsedSpawnTime >= spawnInterval) {
    spawnEnemy();
    elapsedSpawnTime = 0; // Reset the elapsed time
    spawnInterval = getRandomSpawnInterval(); // Get a new random spawn interval
  }

  //updating player and enemy animations and positions
  player.playerAnimationUpdate(timestamp, controlls.isMoving);
  player.playerUpdate(deltaTime, timestamp, controlls.keys);

  for (const enemy of enemies) {
    enemy.enemyAnimationUpdate(timestamp);
    enemy.enemyUpdate(deltaTime, timestamp, currencies);
  }

  for (const currency of currencies) {
    currency.update(deltaTime);
  }

  Global.CTX.clearRect(0, 0, Global.CANVAS_WIDTH, Global.CANVAS_HEIGHT);

  background.draw();

  // Draw the current frame
  for (const enemy of enemies) {
    enemy.enemyDraw(sprite);
    // enemy.drawCollisionBorder();
  }
  for (const currency of currencies) {
    currency.draw(sprite);
  }

  player.playerDraw(sprite);
  // player.drawCollisionBorder();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}
