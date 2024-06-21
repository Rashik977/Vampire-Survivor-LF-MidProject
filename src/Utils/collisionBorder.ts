import { Global } from "../Global";

// for debugging
export function drawCollisionBorder(obj: any) {
  Global.CTX.strokeStyle = "red";
  Global.CTX.lineWidth = 2;
  Global.CTX.strokeRect(
    obj.X - obj.frameWidth / 2,
    obj.Y - obj.frameHeight / 2,
    obj.frameWidth,
    obj.frameHeight
  );
}
