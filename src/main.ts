import "./style.css";
import { Global } from "./Global";
import { Background } from "./Background";
import { Player } from "./Player";
import { Sprite } from "./Sprite";
import { KeyControls } from "./KeyControls";
import { Enemy } from "./Enemy";
import { Currency } from "./Currency";
import { soundManager } from "./SoundManager";

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
let pauseTimestamp: number | null = null;

// Enemy spawn variables
let elapsedSpawnTime = 0;
let spawnInterval = 5000;

controlls.keydown(gameLoop);
controlls.keyup();

// Function to get a random spawn interval within the specified range
function getRandomSpawnInterval() {
  return Math.random() * Math.max(7000 - player.level * 500, 1000);
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

  enemies.push(new Enemy(x, y, 220, 26, player, enemies));
}

document.addEventListener("DOMContentLoaded", () => {
  const handleInteraction = () => {
    soundManager.playMusic();
    // Remove the event listener after the first interaction
    document.removeEventListener("click", handleInteraction);
    document.removeEventListener("keydown", handleInteraction);
  };

  document.addEventListener("click", handleInteraction);
  document.addEventListener("keydown", handleInteraction);
});

function drawVolumeSliders() {
  const sliderWidth = 200;
  const sliderHeight = 20;
  const musicSliderX = (Global.CANVAS_WIDTH - sliderWidth) / 2;
  const musicSliderY = Global.CANVAS_HEIGHT / 2 - 50;
  const sfxSliderX = musicSliderX;
  const sfxSliderY = musicSliderY + 50;

  // Draw music volume slider
  drawSlider(
    musicSliderX,
    musicSliderY,
    sliderWidth,
    sliderHeight,
    soundManager.musicVolume,
    "Music Volume"
  );

  // Draw SFX volume slider
  drawSlider(
    sfxSliderX,
    sfxSliderY,
    sliderWidth,
    sliderHeight,
    soundManager.sfxVolume,
    "SFX Volume"
  );
}

function drawSlider(
  x: number,
  y: number,
  width: number,
  height: number,
  value: number,
  label: string
) {
  Global.CTX.fillStyle = "white";
  Global.CTX.fillRect(x, y, width, height);
  Global.CTX.fillStyle = "green";
  Global.CTX.fillRect(x, y, width * value, height);
  Global.CTX.strokeStyle = "black";
  Global.CTX.lineWidth = 3;
  Global.CTX.strokeRect(x, y, width, height);

  Global.CTX.fillStyle = "white";
  Global.CTX.font = "16px Arial";
  Global.CTX.fillText(label, x, y - 10);
}

let isDraggingMusicSlider = false;
let isDraggingSFXSlider = false;

Global.CANVAS.addEventListener("mousedown", (event: any) => {
  const { offsetX, offsetY } = event;
  const musicSliderX = (Global.CANVAS_WIDTH - 200) / 2;
  const musicSliderY = Global.CANVAS_HEIGHT / 2 - 50;
  const sfxSliderX = musicSliderX;
  const sfxSliderY = musicSliderY + 50;

  if (
    offsetX >= musicSliderX &&
    offsetX <= musicSliderX + 200 &&
    offsetY >= musicSliderY &&
    offsetY <= musicSliderY + 20
  ) {
    isDraggingMusicSlider = true;
  } else if (
    offsetX >= sfxSliderX &&
    offsetX <= sfxSliderX + 200 &&
    offsetY >= sfxSliderY &&
    offsetY <= sfxSliderY + 20
  ) {
    isDraggingSFXSlider = true;
  }
});

Global.CANVAS.addEventListener("mousemove", (event: any) => {
  if (isDraggingMusicSlider || isDraggingSFXSlider) {
    const { offsetX } = event;
    const sliderX = (Global.CANVAS_WIDTH - 200) / 2;
    const value = Math.max(0, Math.min(1, (offsetX - sliderX) / 200));

    if (isDraggingMusicSlider) {
      soundManager.updateVolume(value, soundManager.sfxVolume);
    } else if (isDraggingSFXSlider) {
      soundManager.updateVolume(soundManager.musicVolume, value);
    }
  }
});

Global.CANVAS.addEventListener("mouseup", () => {
  isDraggingMusicSlider = false;
  isDraggingSFXSlider = false;
});

function gameLoop(timestamp: number) {
  if (Global.PAUSE) {
    if (!soundManager.music.paused) {
      soundManager.music.pause();
    }
    if (Global.UPGRADE_CHOICES) {
      // If the player is choosing upgrades, do not show the pause message
      player.drawUpgradeChoices();
    } else if (!Global.GAMEOVER) {
      Global.CTX.fillStyle = "white";
      Global.CTX.font = "60px Arial";
      Global.CTX.fillText(
        "PAUSED",
        Global.CANVAS_WIDTH / 2 - 120,
        Global.CANVAS_HEIGHT / 3
      );
      drawVolumeSliders();
    }
    pauseTimestamp = timestamp;
    lastFrameTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  if (pauseTimestamp) {
    lastFrameTime += timestamp - pauseTimestamp;
    pauseTimestamp = 0;

    // Resume music when the game is unpaused
    if (soundManager.music.paused) {
      soundManager.music.play().catch((error) => {
        console.log("Error resuming music:", error);
      });
    }
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
