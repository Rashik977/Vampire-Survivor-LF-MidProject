import { Global } from "../Global";
import { Player } from "../Player/Player";
import { Upgrade } from "./Upgrade";

// Class to handle the upgrade menu
export class UpgradeMenu {
  upgradeChoices: Upgrade[] | null = null;
  hoveredChoiceIndex: number | null = null;
  upgradeChoicePositions: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];
  gameLoop: any;
  player: Player;

  constructor(gameLoop: any, player: Player) {
    this.upgradeChoices = null;
    this.hoveredChoiceIndex = null;
    this.upgradeChoicePositions = [];
    this.gameLoop = gameLoop;
    this.player = player;
  }

  // Function to prompt the player with upgrade choices
  promptUpgradeChoices() {
    this.upgradeChoices = Upgrade.getRandomUpgrades();
    Global.PAUSE = true;
    Global.UPGRADE_CHOICES = true;
    this.drawUpgradeChoices();

    // Add mouse event listeners for selection and hover
    Global.CANVAS.addEventListener("click", this.handleUpgradeSelection);
    Global.CANVAS.addEventListener("mousemove", this.handleUpgradeHover);
  }

  // Function to draw the upgrade choices
  drawUpgradeChoices() {
    if (!this.upgradeChoices) return;

    Global.CTX.clearRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );
    Global.CTX.fillStyle = "#000000";
    Global.CTX.fillRect(
      -Global.offsetX,
      -Global.offsetY,
      Global.CANVAS_WIDTH,
      Global.CANVAS_HEIGHT
    );

    Global.CTX.fillStyle = "white";
    Global.CTX.font = "20px Arial";
    Global.CTX.letterSpacing = "1px";

    this.upgradeChoicePositions = [];
    const choiceHeight = 100;
    const spacing =
      (Global.CANVAS_HEIGHT - this.upgradeChoices.length * choiceHeight) /
      (this.upgradeChoices.length + 1);

    this.upgradeChoices.forEach((upgrade, index) => {
      const y = spacing + index * (choiceHeight + spacing) - Global.offsetY;
      const x = Global.CANVAS_WIDTH / 2 - 150 - Global.offsetX - 50;
      const width = 400;
      const height = choiceHeight;

      // Store the position and size of the upgrade choice
      this.upgradeChoicePositions.push({ x, y, width, height });

      // Draw the border
      Global.CTX.strokeStyle = "white";
      Global.CTX.lineWidth = 3;
      Global.CTX.strokeRect(x, y, width, height);

      // Change the color if hovered
      if (index === this.hoveredChoiceIndex) {
        Global.CTX.fillStyle = "#1b5e20";
        Global.CTX.fillRect(x, y, width, height);
        Global.CANVAS.style.cursor = "pointer";
      } else {
        Global.CTX.fillStyle = "black";
        Global.CANVAS.style.cursor = "default";
      }

      // Draw the text
      Global.CTX.fillStyle = "white";
      Global.CTX.fillText(upgrade.name, x + 10, y + 30);
      Global.CTX.fillText(upgrade.description, x + 10, y + 60);
    });
  }

  // Function to handle the hover event on the upgrade choices
  handleUpgradeHover = (event: MouseEvent) => {
    const rect = Global.CANVAS.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - Global.offsetX;
    const mouseY = event.clientY - rect.top - Global.offsetY;

    let hoveredIndex: number | null = null;

    this.upgradeChoicePositions.forEach((position, index) => {
      if (
        mouseX >= position.x &&
        mouseX <= position.x + position.width &&
        mouseY >= position.y &&
        mouseY <= position.y + position.height
      ) {
        hoveredIndex = index;
      }
    });

    if (this.hoveredChoiceIndex !== hoveredIndex) {
      this.hoveredChoiceIndex = hoveredIndex;
      this.drawUpgradeChoices();
    }
  };

  // Function to handle the selection event on the upgrade choices
  handleUpgradeSelection = (event: MouseEvent) => {
    const rect = Global.CANVAS.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - Global.offsetX;
    const mouseY = event.clientY - rect.top - Global.offsetY;

    this.upgradeChoicePositions.forEach((position, index) => {
      if (
        mouseX >= position.x &&
        mouseX <= position.x + position.width &&
        mouseY >= position.y &&
        mouseY <= position.y + position.height
      ) {
        if (this.upgradeChoices) {
          const selectedUpgrade = this.upgradeChoices[index];
          this.applyUpgrade(selectedUpgrade);
          this.upgradeChoices = null;
          Global.PAUSE = false;
          Global.UPGRADE_CHOICES = false;
          requestAnimationFrame(this.gameLoop);
          Global.CANVAS.removeEventListener(
            "click",
            this.handleUpgradeSelection
          );
          Global.CANVAS.removeEventListener(
            "mousemove",
            this.handleUpgradeHover
          );
        }
      }
    });
  };

  // Function to apply the selected upgrade
  applyUpgrade(upgrade: Upgrade) {
    switch (upgrade.type) {
      case "speed":
        this.player.speed = Math.min(0.6, this.player.speed + 0.05);
        break;
      case "maxHealth":
        this.player.health = this.player.maxHealth;
        break;
      case "coinAttraction":
        this.player.coinAttractionRange += 10;
        break;
      case "gun":
        Player.ownGun = true;
        break;
      case "gun upgrade":
        this.player.projectileCooldown = Math.max(
          100,
          (this.player.projectileCooldown -= 100)
        );
        this.player.bulletDamage += 10;
        break;
      case "whip upgrade":
        this.player.whip.damage += 5;
        this.player.whip.damageCooldown = Math.max(
          100,
          (this.player.whip.damageCooldown -= 100)
        );
        this.player.whip.attackCooldown = Math.max(
          100,
          (this.player.whip.attackCooldown -= 100)
        );
        break;
      case "shield":
        Player.ownBible = true;
        break;
      case "shield upgrade":
        this.player.shield.rotationSpeed = Math.min(
          15,
          this.player.shield.rotationSpeed + 0.1
        );
        this.player.shield.damage += 3;
        break;
      case "whip":
        Player.ownWhip = true;
    }
  }
}
