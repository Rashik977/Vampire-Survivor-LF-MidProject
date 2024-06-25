import { Global } from "../Global";
import { soundManager } from "./SoundManager";

// Function to draw the volume sliders on the canvas
export function drawVolumeSliders() {
  const sliderWidth = 200;
  const sliderHeight = 20;
  const musicSliderX = (Global.CANVAS_WIDTH - sliderWidth) / 2 - Global.offsetX;
  const musicSliderY = Global.CANVAS_HEIGHT / 2 - 50 - Global.offsetY;
  const sfxSliderX = musicSliderX;
  const sfxSliderY = musicSliderY + 50;

  // Draw music volume slider
  drawSlider(
    musicSliderX,
    musicSliderY,
    sliderWidth,
    sliderHeight,
    soundManager.musicVolume,
    "Music Volume"
  );

  // Draw SFX volume slider
  drawSlider(
    sfxSliderX,
    sfxSliderY,
    sliderWidth,
    sliderHeight,
    soundManager.sfxVolume,
    "SFX Volume"
  );
}

function drawSlider(
  x: number,
  y: number,
  width: number,
  height: number,
  value: number,
  label: string
) {
  Global.CTX.fillStyle = "white";
  Global.CTX.fillRect(x, y, width, height);
  Global.CTX.fillStyle = "green";
  Global.CTX.fillRect(x, y, width * value, height);
  Global.CTX.strokeStyle = "black";
  Global.CTX.lineWidth = 3;
  Global.CTX.strokeRect(x, y, width, height);

  Global.CTX.fillStyle = "white";
  Global.CTX.font = "16px Arial";
  Global.CTX.fillText(label, x, y - 10);
}

export function addVolumeListener() {
  Global.CANVAS.addEventListener("click", (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const musicSliderX = (Global.CANVAS_WIDTH - 200) / 2;
    const musicSliderY = Global.CANVAS_HEIGHT / 2 - 50;
    const sfxSliderX = musicSliderX;
    const sfxSliderY = musicSliderY + 50;

    if (
      offsetX >= musicSliderX &&
      offsetX <= musicSliderX + 200 &&
      offsetY >= musicSliderY &&
      offsetY <= musicSliderY + 20
    ) {
      const value = Math.max(0, Math.min(1, (offsetX - musicSliderX) / 200));
      soundManager.updateVolume(value, soundManager.sfxVolume);
      drawVolumeSliders();
    } else if (
      offsetX >= sfxSliderX &&
      offsetX <= sfxSliderX + 200 &&
      offsetY >= sfxSliderY &&
      offsetY <= sfxSliderY + 20
    ) {
      const value = Math.max(0, Math.min(1, (offsetX - sfxSliderX) / 200));
      soundManager.updateVolume(soundManager.musicVolume, value);
      drawVolumeSliders();
    }
  });
}
