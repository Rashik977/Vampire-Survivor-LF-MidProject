import "./style.css";
import { Global } from "./Global";
import { Background } from "./Background";
import { Player } from "./Player";
import { Sprite } from "./Sprite";
import { KeyControls } from "./KeyControls";
import { Enemy } from "./Enemy";

Global.CANVAS.width = Global.CANVAS_WIDTH;
Global.CANVAS.height = Global.CANVAS_HEIGHT;
Global.CANVAS.style.border = `1px solid ${Global.CANVAS_BORDER_COLOR}`;

const enemies: Enemy[] = [];

const sprite = new Sprite("characters1.png", gameLoop);
const background = new Background(0, 0, "bg_forest.png");
const player = new Player(
  Global.CANVAS_WIDTH / 2,
  Global.CANVAS_HEIGHT / 2,
  0,
  enemies
);
const controlls = new KeyControls();

// Create enemies and pass the player reference
enemies.push(new Enemy(200, 200, 220, player, enemies));
enemies.push(new Enemy(300, 300, 220, player, enemies));

let lastFrameTime: number = 0;

controlls.keydown(gameLoop);
controlls.keyup();

function gameLoop(timestamp: number) {
  if (Global.PAUSE) {
    lastFrameTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  // Calculate the time elapsed since the last frame
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  //updating player and enemy animations and positions
  player.playerAnimationUpdate(timestamp, controlls.isMoving);
  player.playerUpdate(deltaTime, timestamp, controlls.keys);

  for (const enemy of enemies) {
    enemy.enemyAnimationUpdate(timestamp);
    enemy.enemyUpdate(deltaTime, timestamp);
  }

  Global.CTX.clearRect(0, 0, Global.CANVAS_WIDTH, Global.CANVAS_HEIGHT);

  background.draw();

  // Draw the current frame
  for (const enemy of enemies) {
    enemy.enemyDraw(sprite);
    enemy.drawCollisionBorder();
  }

  player.playerDraw(sprite);
  player.drawCollisionBorder();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}
