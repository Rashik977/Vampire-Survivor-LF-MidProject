import { PlayerCreator } from "./Player/PlayerCreator";
import { Enemy } from "./Enemy/Enemy";
import { Game } from "./Game";
import { BackgroundCreator } from "./Background/BackgroundCreator";
import { Sprite } from "./Sprites/Sprite";
import { ObstaclesCreator } from "./Background/ObstaclesCreator";
import { Currency } from "./Elements/Currency";

// Class to initialize the game
export class GameInitialize {
  public static init(): void {
    const enemies: Enemy[] = [];
    const currencies: Currency[] = [];
    const sprite = new Sprite("spriteSheet.png");
    const player = PlayerCreator.createPlayer(enemies);
    const background = BackgroundCreator.createBackground(sprite);
    const obstacles = ObstaclesCreator.createObstacles(sprite);
    Game(player, enemies, sprite, background, obstacles, currencies);
  }
}
