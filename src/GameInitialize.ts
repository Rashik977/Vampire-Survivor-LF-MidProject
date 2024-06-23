import { PlayerCreator } from "./Player/PlayerCreator";
import { Enemy } from "./Enemy/Enemy";
import { Game } from "./Game";

export class GameInitialize {
  public static init(): void {
    const enemies: Enemy[] = [];
    const player = PlayerCreator.createPlayer(enemies);
    Game(player, enemies);
  }
}
