import { Global } from "../Global";
import { Player } from "../Player/Player";

export function drawHealthBar(player: Player) {
  const barWidth = 50;
  const barHeight = 5;
  const x = player.X - barWidth / 2;
  const y = player.Y + player.frameHeight + 10;

  Global.CTX.fillStyle = "black";
  Global.CTX.fillRect(x, y, barWidth + 2, barHeight + 2);

  Global.CTX.fillStyle = "red";
  Global.CTX.fillRect(
    x,
    y,
    (player.health / player.maxHealth) * barWidth,
    barHeight
  );
}
