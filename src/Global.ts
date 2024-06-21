const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const canvasWidth: number = window.innerWidth - 100;
const canvasHeight: number = window.innerHeight - 100;
const canvasBorderColor: string = "black";

export const Global: any = {
  CANVAS: canvas,
  CTX: ctx,
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: canvasHeight,
  CANVAS_BORDER_COLOR: canvasBorderColor,
  PAUSE: false,
  GAMEOVER: false,
  UPGRADE: false,
  offsetX: 0,
  offsetY: 0,
  BackgroundLoaded: false,
  SpriteLoaded: false,
};
