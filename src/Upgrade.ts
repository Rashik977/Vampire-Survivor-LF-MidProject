export type UpgradeType = "speed" | "maxHealth" | "damage" | "coinAttraction";

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
      new Upgrade("maxHealth", "Increase Max Health", "More health"),
      new Upgrade("damage", "Increase Damage", "Deal more damage"),
      new Upgrade(
        "coinAttraction",
        "Increase Coin Attraction",
        "Attract coins from farther away"
      ),
    ];

    // Shuffle and return 3 random upgrades
    for (let i = upgrades.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upgrades[i], upgrades[j]] = [upgrades[j], upgrades[i]];
    }
    return upgrades.slice(0, 3);
  }
}
