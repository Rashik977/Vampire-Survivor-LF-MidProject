import { Global } from "../Global";
import { Sprite } from "../Sprites/Sprite";
import { Obstacle } from "./Obstacles";
import { placeObstaclesRandomly } from "./PlaceObstacles";

// class to return the user selected background obstacles
export class ObstaclesCreator {
  public static createObstacles(sprite: Sprite): Obstacle[] {
    switch (Global.BACKGROUND_INDEX) {
      case 0:
        return placeObstaclesRandomly(sprite, 200, 40, 50, 14, 500);
      case 1:
        return placeObstaclesRandomly(sprite, 200, 40, 50, 10, 720);
      default:
        return placeObstaclesRandomly(sprite, 200, 40, 60, 14, 500);
    }
  }
}
