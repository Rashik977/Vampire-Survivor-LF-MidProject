import { Player } from "./Player";

export type UpgradeType =
  | "speed"
  | "health"
  | "maxHealth"
  | "coinAttraction"
  | "gun"
  | "gun upgrade"
  | "whip upgrade"
  | "shield"
  | "shield upgrade";

export class Upgrade {
  type: UpgradeType;
  name: string;
  description: string;

  constructor(type: UpgradeType, name: string, description: string) {
    this.type = type;
    this.name = name;
    this.description = description;
  }

  static getRandomUpgrades(): Upgrade[] {
    const upgrades = [
      new Upgrade("speed", "Increase Speed", "Move faster"),
      new Upgrade("health", "Increase Health", "More health"),

      new Upgrade(
        "coinAttraction",
        "Increase Coin Attraction",
        "Attract coins from farther away"
      ),
      new Upgrade("gun", "Axe", "shoots the enemies with your axe"),
      new Upgrade("whip upgrade", "Whip Upgrade", "Upgrade your whip"),
      new Upgrade("shield", "Bible", "Shield from enemies with your bible"),
    ];

    if (Player.ownGun) {
      upgrades.splice(3, 1);
      upgrades.push(
        new Upgrade("gun upgrade", "Axe Upgrade", "Upgrade your Axe")
      );
    }

    if (Player.ownBible) {
      upgrades.splice(5, 1);
      upgrades.push(
        new Upgrade("shield upgrade", "Bible Upgrade", "Upgrade your shield")
      );
    }

    // only 30% chance to get max health upgrade
    if (Math.random() > 0.7) {
      upgrades.splice(1, 1);
      upgrades.push(
        new Upgrade("maxHealth", "Increase Health to Max", "Fill your health")
      );
    }

    console.log(upgrades);

    // Shuffle and return 3 random upgrades
    for (let i = upgrades.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upgrades[i], upgrades[j]] = [upgrades[j], upgrades[i]];
    }
    return upgrades.slice(0, 3);
  }
}
