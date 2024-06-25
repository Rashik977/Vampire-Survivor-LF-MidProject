import { Global } from "../Global";

// Function to get a random position on the whole map
export function getRandomPosition() {
  const mapWidth = Global.CANVAS_WIDTH * 2.5;
  const mapHeight = Global.CANVAS_HEIGHT * 2.5;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const direction1 = Math.random() < 0.5 ? -1 : 1;
  const x = Math.random() * mapWidth * direction;
  const y = Math.random() * mapHeight * direction1;

  return { x, y };
}
