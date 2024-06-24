const backgroundInit = [
  {
    name: "forest",
    imgSrc: "Backgrounds/forest.png",
    purchased: true,
  },
  {
    name: "Hell",
    imgSrc: "Backgrounds/hell.png",
    cost: 10,
    purchased: false,
  },
];

export const backgrounds = JSON.parse(
  localStorage.getItem("backgrounds") ?? JSON.stringify(backgroundInit)
);
