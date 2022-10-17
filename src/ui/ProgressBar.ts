import { Container, Graphics } from "pixi.js";

export class ProgressBar extends Container {

  private bar: Container
  // private border: Graphics
  private fill: Graphics

  constructor() {
    super();

    const length = 12
    const thickness = 1

    this.fill = new Graphics()
    this.fill.beginFill(0xffffff, 1)
    this.fill.drawRect(0, 0, length, thickness)
    this.fill.endFill()
    this.fill.scale.x = 0

    // this.border = new Graphics()
    // this.border.lineStyle(10, 0x0, 1)
    // this.border.drawRect(0, 0, length, thickness)

    this.bar = new Container()
    this.bar.addChild(this.fill)
    // this.bar.addChild(this.border)
    this.bar.position.x -= length / 2
    this.addChild(this.bar)
  }

  setProgress(percent: number): void {
    this.fill.scale.x = percent
  }
}
