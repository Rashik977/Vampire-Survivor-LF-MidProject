import { Enemy } from "./Enemy";

export function checkCollisionPlayer(obj1: any, obj2: any) {
  return (
    obj1.X < obj2.X + obj2.frameWidth &&
    obj1.X + obj1.frameWidth > obj2.X &&
    obj1.Y < obj2.Y + obj2.frameHeight &&
    obj1.Y + obj1.frameHeight > obj2.Y
  );
}
export function checkCollisionEnemy(obj1: any, obj2: Enemy) {
  return (
    obj1.X < obj2.X + obj2.frameWidth &&
    obj1.X + obj1.width > obj2.X &&
    obj1.Y < obj2.Y + obj2.frameHeight &&
    obj1.Y + obj1.height > obj2.Y
  );
}

export function normalize(vector: { x: number; y: number }) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}
