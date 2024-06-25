import { Sprite } from "../Sprites/Sprite";
import { Obstacle } from "./Obstacles";
import { isOverlapping } from "../Utils/Utils";
import { getRandomPosition } from "../Utils/getRandomPosition";

// function to place random obstacles on the background
export function placeObstaclesRandomly(
  sprite: Sprite,
  numObstacles: number,
  obstacleWidth: number,
  obstacleHeight: number,
  numOfSprite: number,
  SourceY: number
) {
  const obstacles: Obstacle[] = [];

  for (let i = 0; i < numObstacles; i++) {
    let position;
    do {
      position = getRandomPosition();
    } while (
      isOverlapping(
        position.x,
        position.y,
        obstacleWidth,
        obstacleHeight,
        obstacles
      )
    );

    obstacles.push(
      new Obstacle(
        position.x,
        position.y,
        obstacleWidth,
        obstacleHeight,
        sprite,
        Math.floor(Math.random() * numOfSprite) * 40,
        SourceY
      )
    );
  }

  return obstacles;
}
