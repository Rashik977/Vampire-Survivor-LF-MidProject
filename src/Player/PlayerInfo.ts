// player information initliazaion
const playersInit = [
  {
    name: "Antonio",
    stats:
      "Start Weapon: Whip \n HP: 100 \n Movement Speed: Fast \n Whip => damage : 25, cooldown: fast \n Bible => damage: 10, rotationSpeed: slow \n Axe => damage: 40, cooldown: slow",
    imgSrc: "characters/antonio.png",
    purchased: true,
  },
  {
    name: "GrandPa",
    stats:
      "Start Weapon: Bible \n HP: 150 \n Movement Speed: Slow \n Whip => damage : 20, cooldown: fast \n Bible => damage: 25, rotationSpeed: fast \n Axe => damage: 35, cooldown: medium",
    imgSrc: "characters/grandPa.png",
    cost: 10,
    purchased: false,
  },
  {
    name: "Angel",
    stats:
      "Start Weapon: Axe \n HP: 200 \n Movement Speed: Fast \n Whip => damage : 25, cooldown: slow \n Bible => damage: 20, rotationSpeed: medium \n Axe => damage: 45, cooldown: fast",
    imgSrc: "characters/angel.png",
    cost: 20,
    purchased: false,
  },
];

export const players = JSON.parse(
  localStorage.getItem("players") ?? JSON.stringify(playersInit)
);
