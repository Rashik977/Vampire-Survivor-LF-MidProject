import { Global } from "../Global";

// Button properties
const buttonX = Global.CANVAS_WIDTH / 2 - 70;
const buttonY = Global.CANVAS_HEIGHT / 2 + 100;
const buttonWidth = 150;
const buttonHeight = 50;
const buttonColor = "#FF0000";
const textColor = "#FFFFFF";
const fontSize = 20;
const fontFamily = "Arial";
const text = "Quit Game";

// Draw button
export function drawButton() {
  Global.CTX.fillStyle = buttonColor;
  Global.CTX.fillRect(
    buttonX - Global.offsetX,
    buttonY - Global.offsetY,
    buttonWidth,
    buttonHeight
  );
  Global.CTX.font = `${fontSize}px ${fontFamily}`;
  Global.CTX.fillStyle = textColor;
  Global.CTX.textAlign = "center";
  Global.CTX.textBaseline = "middle";
  Global.CTX.fillText(
    text,
    buttonX + buttonWidth / 2 - Global.offsetX,
    buttonY + buttonHeight / 2 - Global.offsetY
  );
}

// Check if the click is inside the button
function isInsideButton(x: number, y: number) {
  return (
    x >= buttonX &&
    x <= buttonX + buttonWidth &&
    y >= buttonY &&
    y <= buttonY + buttonHeight
  );
}

function QuitButton(event: MouseEvent) {
  const rect = Global.CANVAS.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (isInsideButton(x, y)) {
    window.location.reload();
  }
}

// Add event listener for click
export function addQuitButton() {
  Global.CANVAS.addEventListener("click", QuitButton);
}

export function removeQuitButton() {
  Global.CANVAS.removeEventListener("click", QuitButton);
}
