import { Global } from "../Global";
import { Sprite } from "../Sprites/Sprite";
import { BackgroundTile } from "./Background";

export class BackgroundCreator {
  public static createBackground(sprite: Sprite): BackgroundTile {
    switch (Global.BACKGROUND_INDEX) {
      case 0:
        return new BackgroundTile(sprite.spriteSheet, 0);
      case 1:
        return new BackgroundTile(sprite.spriteSheet, 83);
      default:
        return new BackgroundTile(sprite.spriteSheet, 0);
    }
  }
}
