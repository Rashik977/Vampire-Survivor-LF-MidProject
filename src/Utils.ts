export function checkCollision(obj1: any, obj2: any) {
  return (
    obj1.X < obj2.X + obj2.frameWidth &&
    obj1.X + obj1.frameWidth > obj2.X &&
    obj1.Y < obj2.Y + obj2.frameHeight &&
    obj1.Y + obj1.frameHeight > obj2.Y
  );
}
