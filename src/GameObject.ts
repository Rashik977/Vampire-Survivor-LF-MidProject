export class GameObject {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }
  set X(x: number) {
    this.x = x;
  }
  set Y(y: number) {
    this.y = y;
  }
}
