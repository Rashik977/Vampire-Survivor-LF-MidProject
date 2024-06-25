import { Global } from "../Global";

// Function to draw the loading animation on the canvas
export function drawLoadingAnimation(timestamp: number) {
  const centerX = Global.CANVAS.width / 2;
  const centerY = Global.CANVAS.height / 2;
  const radius = 30;
  const lineWidth = 10;

  Global.CTX.clearRect(0, 0, Global.CANVAS.width, Global.CANVAS.height);

  Global.CTX.strokeStyle = "white";
  Global.CTX.lineWidth = lineWidth;
  Global.CTX.beginPath();
  Global.CTX.arc(
    centerX,
    centerY,
    radius,
    0,
    (Math.PI * 2 * (timestamp % 1000)) / 1000
  );
  Global.CTX.stroke();
}
