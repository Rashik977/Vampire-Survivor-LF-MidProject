import { Global } from "./Global";

export class KeyControls {
  public isMoving: boolean;
  public keys: any;

  constructor() {
    this.isMoving = false;

    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
  }

  keydown(gameLoop: any) {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.keys.left = true;
        this.isMoving = true;
      } else if (event.key === "ArrowRight") {
        this.keys.right = true;
        this.isMoving = true;
      } else if (event.key === "ArrowUp") {
        this.keys.up = true;
        this.isMoving = true;
      } else if (event.key === "ArrowDown") {
        this.keys.down = true;
        this.isMoving = true;
      } else if (event.key === "p" || event.key === "P") {
        Global.PAUSE = !Global.PAUSE;
        requestAnimationFrame(gameLoop);
      } else if (Global.GAMEOVER && event.key === "Enter") {
        location.reload();
      }
    });
  }

  keyup() {
    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft") {
        this.keys.left = false;
      } else if (event.key === "ArrowRight") {
        this.keys.right = false;
      } else if (event.key === "ArrowUp") {
        this.keys.up = false;
      } else if (event.key === "ArrowDown") {
        this.keys.down = false;
      }
      this.isMoving =
        this.keys.left || this.keys.right || this.keys.up || this.keys.down;
    });
  }
}
