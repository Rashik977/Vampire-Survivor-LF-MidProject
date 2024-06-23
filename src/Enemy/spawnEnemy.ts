import { Player } from "../Player/Player";
import { Global } from "../Global";
import { Enemy } from "./Enemy";

// Function to get a random spawn interval within the specified range
export function getRandomSpawnInterval(player: Player) {
  return Math.random() * Math.max(4500 - player.level * 500, 500);
}

// Function to spawn enemies at random positions outside the canvas
export function spawnEnemy(player: Player, enemies: Enemy[]) {
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

  const random = Math.floor(Math.random() * 2);

  if (player.level < 3 || random === 0) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        220,
        37,
        30,
        26 + player.level,
        player,
        enemies
      )
    );
  }

  if (player.level >= 3 && random === 1) {
    enemies.push(
      new Enemy(
        x - Global.offsetX,
        y - Global.offsetY,
        250,
        40,
        40,
        40 + player.level,
        player,
        enemies
      )
    );
  }
}
