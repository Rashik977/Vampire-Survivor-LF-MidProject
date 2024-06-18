const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const canvasWidth: number = 1280;
const canvasHeight: number = 720;
const canvasBorderColor: string = "black";

export const Global: any = {
  CANVAS: canvas,
  CTX: ctx,
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: canvasHeight,
  CANVAS_BORDER_COLOR: canvasBorderColor,
  PAUSE: false,
  GAMEOVER: false,
};
