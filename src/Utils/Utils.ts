import { Enemy } from "../Enemy/Enemy";
import { Obstacle } from "../Background/Obstacles";
import { Player } from "../Player";

export function checkCollisionPlayer(obj1: any, obj2: any): boolean {
  return (
    obj1.X < obj2.X + obj2.frameWidth &&
    obj1.X + obj1.frameWidth > obj2.X &&
    obj1.Y < obj2.Y + obj2.frameHeight &&
    obj1.Y + obj1.frameHeight > obj2.Y
  );
}
export function checkCollisionEnemy(obj1: any, obj2: Enemy): boolean {
  return (
    obj1.X < obj2.X + obj2.frameWidth &&
    obj1.X + obj1.width > obj2.X &&
    obj1.Y < obj2.Y + obj2.frameHeight &&
    obj1.Y + obj1.height > obj2.Y
  );
}

export function checkCollisionObstacle(
  player: Player,
  obstacle: Obstacle
): boolean {
  return (
    player.X < obstacle.X + obstacle.width &&
    player.X + player.frameWidth > obstacle.X &&
    player.Y < obstacle.Y + obstacle.height &&
    player.Y + player.frameHeight > obstacle.Y
  );
}

export function normalize(vector: { x: number; y: number }) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

export function isOverlapping(
  x: number,
  y: number,
  width: number,
  height: number,
  obstacles: Obstacle[]
): boolean {
  for (const obstacle of obstacles) {
    const distanceX = Math.abs(x - obstacle.X);
    const distanceY = Math.abs(y - obstacle.Y);
    const combinedHalfWidths = (width + obstacle.width) / 2;
    const combinedHalfHeights = (height + obstacle.height) / 2;

    if (distanceX < combinedHalfWidths && distanceY < combinedHalfHeights) {
      return true;
    }
  }
  return false;
}
