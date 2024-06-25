import { Player } from "../Player/Player";
import { Global } from "../Global";
import { Enemy } from "./Enemy";

// Function to get a random spawn interval
export function getRandomSpawnInterval(player: Player) {
  return Math.random() * Math.max(4500 - player.level * 500, 400);
}

// Function to spawn enemies at random positions outside the canvas
export function spawnEnemy(player: Player, enemies: Enemy[]) {
  // Randomly spawn the enemy on one of the four sides of the canvas
  const side = Math.floor(Math.random() * 4);
  let x: number = 0,
    y: number = 0;

  switch (side) {
    case 0: // Top
      x = Math.random() * Global.CANVAS_WIDTH;
      y = -50;
      break;

    case 1: // Right
      x = Global.CANVAS_WIDTH + 50;
      y = Math.random() * Global.CANVAS_HEIGHT;
      break;

    case 2: // Bottom
      x = Math.random() * Global.CANVAS_WIDTH;
      y = Global.CANVAS_HEIGHT + 50;
      break;

    case 3: // Left
      x = -50;
      y = Math.random() * Global.CANVAS_HEIGHT;
      break;
  }

  // Randomly select the type of enemy to spawn based on player level
  const random = Math.floor(Math.random() * 4);

  if (player.level <= 1 || (random === 0 && player.level !== 4)) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        220,
        37,
        30,
        26 + Math.max(0, player.level - 10) * 2,
        0.03,
        player,
        enemies
      )
    );
  }

  if (player.level >= 2 && random === 1 && player.level !== 4) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        250,
        40,
        40,
        40 + Math.max(0, player.level - 10) * 2,
        0.02,
        player,
        enemies
      )
    );
  }

  if (player.level >= 3 && random === 2 && player.level !== 4) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        290,
        60,
        50,
        55 + Math.max(0, player.level - 10) * 2,
        0.02,
        player,
        enemies
      )
    );
  }

  if (
    (player.level >= 4 && random === 3) ||
    (player.level === 4 && random >= 0)
  ) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        180,
        40,
        40,
        15 + Math.max(0, player.level - 10) * 2,
        Math.min(0.1 + Math.min(0.4, Math.max(0, player.level - 3) * 0.01), 1),
        player,
        enemies
      )
    );
  }
}
