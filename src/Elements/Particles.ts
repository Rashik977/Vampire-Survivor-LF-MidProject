import { Global } from "../Global";
import { GameObject } from "../GameObject";

export class Particle extends GameObject {
  public size: number;
  public color: string;
  public velocityX: number;
  public velocityY: number;
  public lifetime: number;
  public age: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.size = Math.random() * 3 + 1; // Random size between 1 and 3
    this.color = "red";

    // Randomize the direction using an angle and speed
    const angle = Math.random() * -Math.PI; // Random angle in radians
    const speed = Math.random(); // Random speed
    this.velocityX = speed * Math.cos(angle);
    this.velocityY = speed * Math.sin(angle);

    this.lifetime = 500; // Lifetime in milliseconds
    this.age = 0;
  }

  update(deltaTime: number) {
    this.X += this.velocityX * deltaTime;
    this.Y += this.velocityY * deltaTime;
    this.age += deltaTime;
  }

  draw() {
    Global.CTX.fillStyle = this.color;
    Global.CTX.fillRect(this.X, this.Y, this.size, this.size);
  }

  isAlive() {
    return this.age < this.lifetime;
  }
}
