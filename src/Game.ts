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
import { drawVolumeSliders } from "./Sound/volumeSlider";
import { UpgradeMenu } from "./Upgrade/upgradeMenu";
import { startGame } from "./UI/StartScreen";
import { drawTimer } from "./Elements/Timer";
import { deathCounter } from "./Elements/deathCount";
import { drawButton } from "./Elements/QuitButton";

Global.init();

export function Game(
  player: Player,
  enemies: Enemy[],
  sprite: Sprite,
  backgroundTile: BackgroundTile,
  obstacles: Obstacle[],
  currencies: Currency[]
) {
  // Create upgrade menu
  const upgradeMenu = new UpgradeMenu(gameLoop, player);

  // Create key controls
  const controlls = new KeyControls();
  controlls.keydown(gameLoop);
  controlls.keyup();

  // Game loop variables
  let lastFrameTime: number = 0;
  let pauseTimestamp: number | null = null;
  let startTime = Date.now();
  let pauseStartTime: number | null = null;
  let totalPausedTime: number = 0;

  // Enemy spawn variables
  let elapsedSpawnTime = 0;
  let spawnInterval = 5000;

  // Play background music
  soundManager.playMusic();

  // Check if player has enough coins/diamonds to level up
  function checkLevelUp() {
    while (player.collectedDiamonds >= player.level * 5) {
      player.collectedDiamonds = 0;
      player.level += 1;
      soundManager.playSFX("level_up");
      upgradeMenu.promptUpgradeChoices();
    }
  }

  soundManager.checkIfAudioLoaded();

  // Main game loop
  function gameLoop(timestamp: number) {
    // Check if all assets are loaded
    if (!Global.SpriteLoaded || !soundManager.audioLoaded) {
      drawLoadingAnimation(timestamp);
      requestAnimationFrame(gameLoop);
      return;
    }
    checkLevelUp();

    // Check if the game is paused
    if (Global.PAUSE) {
      // Pause music when the game is paused
      if (!soundManager.music.paused) {
        soundManager.music.pause();
      }
      if (!pauseStartTime) {
        pauseStartTime = Date.now();
      }

      // Draw the pause screen
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

      // Save the timestamp when the game is paused
      pauseTimestamp = timestamp;
      lastFrameTime = timestamp;
      startTime = startTime;

      return;
    } else if (pauseStartTime) {
      // Add the time spent paused to the total paused time
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

    // Calculate the time elapsed since the game started
    const elapsedSeconds = (Date.now() - startTime - totalPausedTime) / 1000;

    // Calculate the time elapsed since the last frame
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // Update elapsed spawn time
    elapsedSpawnTime += deltaTime;

    // Check if it's time to spawn a new enemy
    if (elapsedSpawnTime >= spawnInterval) {
      spawnEnemy(player, enemies);
      elapsedSpawnTime = 0;
      spawnInterval = getRandomSpawnInterval(player);
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

    // Clear the canvas
    Global.CTX.clearRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );

    // Draw the background
    backgroundTile.draw(Global.CTX);

    // Draw obstacles
    for (const obstacle of obstacles) {
      obstacle.draw();
    }

    //Draw currency
    for (const currency of currencies) {
      currency.draw(sprite);
    }

    // Draw the enemies
    for (const enemy of enemies) {
      enemy.enemyDraw(sprite);
    }

    // Draw the player
    player.playerDraw(sprite, elapsedSeconds);

    //Draw the timer
    drawTimer(elapsedSeconds);

    // Draw the score
    deathCounter(Global.SCORE);

    // Request the next frame
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
  //start loading audio in the start menu as some audio files are large
  soundManager.checkIfAudioLoaded();

  // Start the game
  startGame();
});
