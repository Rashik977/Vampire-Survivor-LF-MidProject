export class Sprite {
  public spriteSheet: HTMLImageElement;
  constructor(spriteSheet: string, gameLoop: any) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheet;
    this.spriteSheet.onload = () => {
      requestAnimationFrame(gameLoop);
    };
  }
}
