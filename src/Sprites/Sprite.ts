export class Sprite {
  public spriteSheet: HTMLImageElement;
  constructor(spriteSheet: string) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheet;
  }
}
