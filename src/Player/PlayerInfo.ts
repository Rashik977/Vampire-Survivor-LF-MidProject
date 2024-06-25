const playersInit = [
  {
    name: "Antonio",
    stats:
      "Start Weapon: Whip \n HP: 100 \n Movement Speed: Fast \n Whip => damage : 15, cooldown: fast \n Bible => damage: 5, rotationSpeed: Medium \n Axe => damage: 20, cooldown: slow",
    imgSrc: "characters/antonio.png",
    purchased: true,
  },
  {
    name: "GrandPa",
    stats:
      "Start Weapon: Bible \n HP: 150 \n Movement Speed: Slow \n Whip => damage : 20, cooldown: slow \n Bible => damage: 15, rotationSpeed: fast \n Axe => damage: 25, cooldown: medium",
    imgSrc: "characters/grandPa.png",
    cost: 10,
    purchased: false,
  },
  {
    name: "Angel",
    stats:
      "Start Weapon: Axe \n HP: 200 \n Movement Speed: Fast \n Whip => damage : 30, cooldown: slow \n Bible => damage: 25, rotationSpeed: fast \n Axe => damage: 35, cooldown: fast",
    imgSrc: "characters/angel.png",
    cost: 20,
    purchased: false,
  },
];

export const players = JSON.parse(
  localStorage.getItem("players") ?? JSON.stringify(playersInit)
);
