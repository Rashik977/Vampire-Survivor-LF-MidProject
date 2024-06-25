import { Global } from "../Global";

// class to handle the key controls
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

  // function to handle the keydown event
  keydown(gameLoop: any) {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        this.keys.left = true;
        this.isMoving = true;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        this.keys.right = true;
        this.isMoving = true;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === "W"
      ) {
        this.keys.up = true;
        this.isMoving = true;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        this.keys.down = true;
        this.isMoving = true;
      } else if (
        event.key === "p" ||
        event.key === "P" ||
        event.key === "Escape"
      ) {
        Global.PAUSE = !Global.PAUSE;
        requestAnimationFrame(gameLoop);
      } else if (Global.GAMEOVER && event.key === "Enter") {
        location.reload();
      }
    });
  }

  // function to handle the keyup event
  keyup() {
    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        this.keys.left = false;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        this.keys.right = false;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === "W"
      ) {
        this.keys.up = false;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        this.keys.down = false;
      }
      this.isMoving =
        this.keys.left || this.keys.right || this.keys.up || this.keys.down;
    });
  }
}
