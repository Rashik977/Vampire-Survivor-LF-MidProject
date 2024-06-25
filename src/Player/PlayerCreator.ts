import { Global } from "../Global";
import { Player } from "./Player";

// Class to return the user selected player
export class PlayerCreator {
  public static createPlayer(enemies: any): Player {
    let player: Player;
    switch (Global.PLAYER_INDEX) {
      case 0:
        //default weapon
        Player.ownWhip = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 100);
        //speed
        player.speed = 0.2;
        //whip
        player.whip.damage = 25;
        player.whip.damageCooldown = 800;
        player.whip.attackCooldown = 800;
        //shield
        player.shield.rotationSpeed = 3;
        player.shield.damage = 10;
        //gun
        player.projectileCooldown = 1000;
        player.bulletDamage = 40;

        return player;
      case 1:
        //default weapon
        Player.ownBible = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 150);
        //speed
        player.speed = 0.1;
        //whip
        player.whip.damage = 20;
        player.whip.damageCooldown = 800;
        player.whip.attackCooldown = 800;
        //shield
        player.shield.rotationSpeed = 5;
        player.shield.damage = 25;
        //gun
        player.projectileCooldown = 800;
        player.bulletDamage = 35;

        return player;
      case 2:
        //default weapon
        Player.ownGun = true;
        player = new Player(Global.PLAYER_INDEX * 37, enemies, 150);
        //speed
        player.speed = 0.2;
        //whip
        player.whip.damage = 25;
        player.whip.damageCooldown = 1000;
        player.whip.attackCooldown = 1000;
        //shield
        player.shield.rotationSpeed = 4;
        player.shield.damage = 20;
        //gun
        player.projectileCooldown = 500;
        player.bulletDamage = 45;

        return player;
      default:
        return new Player(Global.PLAYER_INDEX * 37, enemies, 100);
    }
  }
}
