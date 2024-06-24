import { PlayerCreator } from "./Player/PlayerCreator";
import { Enemy } from "./Enemy/Enemy";
import { Game } from "./Game";
import { BackgroundCreator } from "./Background/BackgroundCreator";
import { Sprite } from "./Sprites/Sprite";
import { ObstaclesCreator } from "./Background/ObstavlesCreator";

export class GameInitialize {
  public static init(): void {
    const enemies: Enemy[] = [];
    const sprite = new Sprite("characters1.png");
    const player = PlayerCreator.createPlayer(enemies);
    const background = BackgroundCreator.createBackground(sprite);
    const obstacles = ObstaclesCreator.createObstacles(sprite);
    Game(player, enemies, sprite, background, obstacles);
  }
}
