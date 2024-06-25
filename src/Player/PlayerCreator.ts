import { Global } from "../Global";
import { Player } from "./Player";

export class PlayerCreator {
  public static createPlayer(enemies: any): Player {
    let player: Player;
    switch (Global.PLAYER_INDEX) {
      case 0:
        //default weapon
        Player.ownWhip = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 100);
        //speed
        player.speed = 0.15;
        //whip
        player.whip.damage = 15;
        player.whip.damageCooldown = 800;
        player.whip.attackCooldown = 800;
        //shield
        player.shield.rotationSpeed = 2;
        player.shield.damage = 5;
        //gun
        player.projectileCooldown = 1000;
        player.bulletDamage = 20;

        return player;
      case 1:
        //default weapon
        Player.ownBible = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 150);
        //speed
        player.speed = 0.1;
        //whip
        player.whip.damage = 20;
        player.whip.damageCooldown = 1000;
        player.whip.attackCooldown = 1000;
        //shield
        player.shield.rotationSpeed = 3;
        player.shield.damage = 15;
        //gun
        player.projectileCooldown = 800;
        player.bulletDamage = 25;

        return player;
      case 2:
        //default weapon
        Player.ownGun = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 150);
        //speed
        player.speed = 0.2;
        //whip
        player.whip.damage = 30;
        player.whip.damageCooldown = 1000;
        player.whip.attackCooldown = 1000;
        //shield
        player.shield.rotationSpeed = 4;
        player.shield.damage = 25;
        //gun
        player.projectileCooldown = 500;
        player.bulletDamage = 35;

        return player;
      default:
        return new Player(Global.PLAYER_INDEX * 37, enemies, 100);
    }
  }
}
