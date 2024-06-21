import { Global } from "./Global";

// export class Background extends GameObject {
//   private image: HTMLImageElement;
//   constructor(x: number, y: number, src: string) {
//     super(x, y);
//     this.image = new Image();
//     this.image.src = src;
//     this.image.onload = () => {
//       Global.BackgroundLoaded = true;
//     };
//   }
//   draw() {
//     Global.CTX.drawImage(
//       this.image,
//       (-Global.CANVAS_WIDTH * 4) / 2,
//       (-Global.CANVAS_HEIGHT * 4) / 2,
//       Global.CANVAS_WIDTH * 5,
//       Global.CANVAS_HEIGHT * 5
//     );
//   }
// }

export class BackgroundTile {
  private offScreenCanvas: HTMLCanvasElement;
  private offScreenCtx: CanvasRenderingContext2D;
  private numTilesX: number;
  private numTilesY: number;
  private tileWidth: number;
  private tileHeight: number;
  private tileImage: HTMLImageElement;

  constructor(tileImage: HTMLImageElement) {
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

    // Draw the entire tile map on the off-screen canvas
    this.tileImage.onload = () => {
      this.drawTileMap();
    };
  }

  private drawTileMap() {
    for (let x = 0; x < this.numTilesX; x++) {
      for (let y = 0; y < this.numTilesY; y++) {
        this.offScreenCtx.drawImage(
          this.tileImage,
          0,
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

// public draw(ctx: CanvasRenderingContext2D) {
//   const drawX = this.offScreenCanvas.width;
//   const drawY = this.offScreenCanvas.height;

//   // Draw the off-screen canvas onto the main canvas
//   ctx.drawImage(this.offScreenCanvas, drawX, drawY);
// }

// // Usage example
// const tileWidth = 85;
// const tileHeight = 80;
// const mapWidth = Global.CANVAS_WIDTH * 5;
// const mapHeight = Global.CANVAS_HEIGHT * 5;
// const background = new BackgroundTile(0, 0, "tile-sprite-sheet.png", 85, 80, Global.CANVAS_WIDTH * 5, Global.CANVAS_HEIGHT * 5);

// draw() {
//   const numTilesX = Math.ceil(this.mapWidth / this.tileWidth);
//   const numTilesY = Math.ceil(this.mapHeight / this.tileHeight);

//   for (let y = 0; y < numTilesY; y++) {
//     for (let x = 0; x < numTilesX; x++) {
//       Global.CTX.drawImage(
//         this.tileImage,
//         0,
//         560,
//         this.tileWidth,
//         this.tileHeight, // Source
//         x * this.tileWidth,
//         y * this.tileHeight, // Destination
//         this.tileWidth + 75,
//         this.tileHeight + 70 // Destination dimensions
//       );
//     }
//   }
// }
