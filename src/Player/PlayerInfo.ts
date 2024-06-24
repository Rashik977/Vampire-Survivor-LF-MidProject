const playersInit = [
  {
    name: "Antonio",
    stats:
      "HP: 100 \n Whip => damage : 15, cooldown: fast \n Shield => damage: 5, rotationSpeed: Medium \n Gun => damage: 20, cooldown: slow",
    imgSrc: "characters/antonio.png",
    purchased: true,
  },
  {
    name: "GrandPa",
    stats:
      "HP: 150 \n Whip => damage : 20, cooldown: slow \n Shield => damage: 15, rotationSpeed: fast \n Gun => damage: 25, cooldown: medium",
    imgSrc: "characters/grandPa.png",
    cost: 10,
    purchased: false,
  },
];

export const players = JSON.parse(
  localStorage.getItem("players") ?? JSON.stringify(playersInit)
);
