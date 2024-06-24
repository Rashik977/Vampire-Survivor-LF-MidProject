import { Sprite } from "../Sprites/Sprite";
import { Obstacle } from "./Obstacles";
import { Global } from "../Global";
import { isOverlapping } from "../Utils/Utils";

function getRandomPosition() {
  const mapWidth = Global.CANVAS_WIDTH * 2.5;
  const mapHeight = Global.CANVAS_HEIGHT * 2.5;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const direction1 = Math.random() < 0.5 ? -1 : 1;
  const x = Math.random() * mapWidth * direction;
  const y = Math.random() * mapHeight * direction1;

  return { x, y };
}

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
    ); // Assuming obstacles are from the same sprite position
  }

  return obstacles;
}
