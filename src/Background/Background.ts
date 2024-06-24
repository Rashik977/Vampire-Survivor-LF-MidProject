import { Global } from "../Global";
//Class to draw the background tiles
export class BackgroundTile {
  private offScreenCanvas: HTMLCanvasElement;
  private offScreenCtx: CanvasRenderingContext2D;
  private numTilesX: number;
  private numTilesY: number;
  private tileWidth: number;
  private tileHeight: number;
  private tileImage: HTMLImageElement;
  private sourceX: number;

  constructor(tileImage: HTMLImageElement, sourceX: number) {
    this.tileWidth = 85;
    this.tileHeight = 80;
    this.numTilesX = Math.ceil(
      (Global.CANVAS_WIDTH * 5 + Global.CANVAS_WIDTH) / this.tileWidth
    );
    this.numTilesY = Math.ceil(
      (Global.CANVAS_HEIGHT * 5 + Global.CANVAS_HEIGHT) / this.tileHeight
    );

    // Create an off-screen canvas
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenCanvas.width = this.numTilesX * this.tileWidth;
    this.offScreenCanvas.height = this.numTilesY * this.tileHeight;
    this.offScreenCtx = this.offScreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.tileImage = tileImage;
    this.sourceX = sourceX;

    // Draw the entire tile map on the off-screen canvas
    this.tileImage.onload = () => {
      Global.SpriteLoaded = true;
      this.drawTileMap(this.sourceX);
    };
  }

  private drawTileMap(sourceX: number) {
    for (let x = 0; x < this.numTilesX; x++) {
      for (let y = 0; y < this.numTilesY; y++) {
        this.offScreenCtx.drawImage(
          this.tileImage,
          sourceX,
          560, // Source coordinates
          this.tileImage.width,
          this.tileImage.height, // Source dimensions
          x * this.tileWidth,
          y * this.tileHeight,
          this.tileWidth * 20,
          this.tileHeight * 20 // Destination dimensions
        );
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.offScreenCanvas,
      -Global.CANVAS_WIDTH * 2,
      -Global.CANVAS_HEIGHT * 2
    );
  }
}
