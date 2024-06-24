export class Global {
  public static CANVAS: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  public static CTX: CanvasRenderingContext2D = Global.CANVAS.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  public static UIWRAPPER: HTMLElement = document.querySelector(
    ".start-screen-wrapper"
  ) as HTMLElement;
  public static CANVAS_WIDTH: number = window.innerWidth - 100;
  public static CANVAS_HEIGHT: number = window.innerHeight - 100;
  public static CANVAS_BORDER_COLOR: string = "black";
  public static PAUSE: boolean = false;
  public static GAMEOVER: boolean = false;
  public static UPGRADE_CHOICES: boolean = false;
  public static offsetX: number = 0;
  public static offsetY: number = 0;
  public static SpriteLoaded: boolean = false;

  public static PLAYER_INDEX: number = 0;
  public static SCORE: number;

  public static init(): void {
    Global.CANVAS.width = Global.CANVAS_WIDTH;
    Global.CANVAS.height = Global.CANVAS_HEIGHT;
    Global.UIWRAPPER.style.width = `${Global.CANVAS_WIDTH}px`;
    Global.UIWRAPPER.style.height = `${Global.CANVAS_HEIGHT}px`;
    Global.CANVAS.style.border = `1px solid ${Global.CANVAS_BORDER_COLOR}`;
    Global.SCORE = parseInt(localStorage.getItem("score") ?? "0");
  }
}
