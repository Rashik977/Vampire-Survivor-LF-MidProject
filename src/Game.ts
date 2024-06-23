import "./style.css";
import { Global } from "./Global";
import { BackgroundTile } from "./Background/Background";
import { Player } from "./Player/Player";
import { Sprite } from "./Sprites/Sprite";
import { KeyControls } from "./KeyControls";
import { Enemy } from "./Enemy/Enemy";
import { Currency } from "./Elements/Currency";
import { soundManager } from "./Sound/SoundManager";
import { Obstacle } from "./Background/Obstacles";
import { drawLoadingAnimation } from "./Utils/Loading";
import { placeObstaclesRandomly } from "./Background/PlaceObstacles";
import { spawnEnemy, getRandomSpawnInterval } from "./Enemy/spawnEnemy";
import { addVolumeListener, drawVolumeSliders } from "./Sound/volumeSlider";
import { UpgradeMenu } from "./Upgrade/upgradeMenu";
import { startGame } from "./UI/StartScreen";

Global.init();

export function Game(player: Player, enemies: Enemy[]) {
  const currencies: Currency[] = [];

  const sprite = new Sprite("characters1.png");
  const backgroundTile = new BackgroundTile(sprite.spriteSheet);

  const upgradeMenu = new UpgradeMenu(gameLoop, player);

  const controlls = new KeyControls();
  controlls.keydown(gameLoop);
  controlls.keyup();

  let lastFrameTime: number = 0;
  let pauseTimestamp: number | null = null;

  // Enemy spawn variables
  let elapsedSpawnTime = 0;
  let spawnInterval = 5000;

  // Load obstacles
  const obstacles: Obstacle[] = placeObstaclesRandomly(sprite, 200, 40, 50);

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
      if (!Global.UPGRADE_CHOICES && !Global.GAMEOVER) {
        Global.CTX.fillStyle = "white";
        Global.CTX.font = "60px Arial";
        Global.CTX.fillText(
          "PAUSED",
          Global.CANVAS_WIDTH / 2 - 120 - Global.offsetX,
          Global.CANVAS_HEIGHT / 3 - Global.offsetY
        );
        drawVolumeSliders();
      }
      pauseTimestamp = timestamp;
      lastFrameTime = timestamp;
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

    // Request the next frame
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
  soundManager.checkIfAudioLoaded(); // Ensure audio is checked when DOM is ready
  startGame();
});
