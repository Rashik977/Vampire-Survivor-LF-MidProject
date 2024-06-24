import "./style.css";
import { Global } from "./Global";
import { BackgroundTile } from "./Background/Background";
import { Player } from "./Player/Player";
import { Sprite } from "./Sprites/Sprite";
import { KeyControls } from "./Input/KeyControls";
import { Enemy } from "./Enemy/Enemy";
import { Currency } from "./Elements/Currency";
import { soundManager } from "./Sound/SoundManager";
import { Obstacle } from "./Background/Obstacles";
import { drawLoadingAnimation } from "./Utils/Loading";
import { spawnEnemy, getRandomSpawnInterval } from "./Enemy/spawnEnemy";
import { addVolumeListener, drawVolumeSliders } from "./Sound/volumeSlider";
import { UpgradeMenu } from "./Upgrade/upgradeMenu";
import { startGame } from "./UI/StartScreen";
import { drawTimer } from "./Elements/Timer";
import { deathCounter } from "./Elements/deathCount";

Global.init();

export function Game(
  player: Player,
  enemies: Enemy[],
  sprite: Sprite,
  backgroundTile: BackgroundTile,
  obstacles: Obstacle[]
) {
  const currencies: Currency[] = [];

  const upgradeMenu = new UpgradeMenu(gameLoop, player);

  const controlls = new KeyControls();
  controlls.keydown(gameLoop);
  controlls.keyup();

  let lastFrameTime: number = 0;
  let pauseTimestamp: number | null = null;

  let startTime = Date.now();
  let pauseStartTime: number | null = null;
  let totalPausedTime: number = 0;

  // Enemy spawn variables
  let elapsedSpawnTime = 0;
  let spawnInterval = 5000;

  soundManager.playMusic();

  addVolumeListener();

  function checkLevelUp() {
    while (player.collectedDiamonds >= player.level * 5) {
      player.collectedDiamonds = 0;
      player.level += 1;
      soundManager.playSFX("level_up");
      upgradeMenu.promptUpgradeChoices();
    }
  }

  // Button properties
  const buttonX = Global.CANVAS_WIDTH / 2 - 70;
  const buttonY = Global.CANVAS_HEIGHT / 2 + 100; // Position below volume sliders
  const buttonWidth = 150;
  const buttonHeight = 50;
  const buttonColor = "#FF0000"; // Red color
  const textColor = "#FFFFFF"; // White color for text
  const fontSize = 20;
  const fontFamily = "Arial";
  const text = "Quit Game";

  // Draw button
  function drawButton() {
    Global.CTX.fillStyle = buttonColor;
    Global.CTX.fillRect(
      buttonX - Global.offsetX,
      buttonY - Global.offsetY,
      buttonWidth,
      buttonHeight
    );
    Global.CTX.font = `${fontSize}px ${fontFamily}`;
    Global.CTX.fillStyle = textColor;
    Global.CTX.textAlign = "center";
    Global.CTX.textBaseline = "middle";
    Global.CTX.fillText(
      text,
      buttonX + buttonWidth / 2 - Global.offsetX,
      buttonY + buttonHeight / 2 - Global.offsetY
    );
  }

  // Check if the click is inside the button
  function isInsideButton(x: number, y: number) {
    return (
      x >= buttonX &&
      x <= buttonX + buttonWidth &&
      y >= buttonY &&
      y <= buttonY + buttonHeight
    );
  }

  // Add event listener for click
  Global.CANVAS.addEventListener("click", function (event) {
    const rect = Global.CANVAS.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isInsideButton(x, y)) {
      window.location.reload();
    }
  });

  soundManager.checkIfAudioLoaded();

  function gameLoop(timestamp: number) {
    if (!Global.SpriteLoaded || !soundManager.audioLoaded) {
      drawLoadingAnimation(timestamp);
      requestAnimationFrame(gameLoop);
      return;
    }
    checkLevelUp();
    if (Global.PAUSE) {
      if (!soundManager.music.paused) {
        soundManager.music.pause();
      }
      if (!pauseStartTime) {
        pauseStartTime = Date.now();
      }
      if (!Global.UPGRADE_CHOICES && !Global.GAMEOVER) {
        Global.CTX.fillStyle = "white";
        Global.CTX.font = "60px Arial";
        Global.CTX.fillText(
          "PAUSED",
          Global.CANVAS_WIDTH / 2 - 120 - Global.offsetX,
          Global.CANVAS_HEIGHT / 3 - Global.offsetY
        );
        drawVolumeSliders();
        Global.CTX.save();
        drawButton();
        Global.CTX.restore();
      }
      pauseTimestamp = timestamp;
      lastFrameTime = timestamp;
      startTime = startTime;

      return;
    } else if (pauseStartTime) {
      totalPausedTime += Date.now() - pauseStartTime;
      pauseStartTime = null;
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

    const elapsedSeconds = (Date.now() - startTime - totalPausedTime) / 1000;
    // Calculate the time elapsed since the last frame
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // Update elapsed spawn time
    elapsedSpawnTime += deltaTime;

    // Check if it's time to spawn a new enemy
    if (elapsedSpawnTime >= spawnInterval) {
      spawnEnemy(player, enemies);
      elapsedSpawnTime = 0; // Reset the elapsed time
      spawnInterval = getRandomSpawnInterval(player); // Get a new random spawn interval
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

    Global.CTX.clearRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );

    backgroundTile.draw(Global.CTX);

    for (const currency of currencies) {
      currency.draw(sprite);
    }

    // Draw obstacles
    for (const obstacle of obstacles) {
      obstacle.draw();
    }

    // Draw the current frame
    for (const enemy of enemies) {
      enemy.enemyDraw(sprite);
    }

    player.playerDraw(sprite);
    drawTimer(elapsedSeconds);
    deathCounter(Global.SCORE);

    // Request the next frame
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
  soundManager.checkIfAudioLoaded(); // Ensure audio is checked when DOM is ready
  startGame();
});
