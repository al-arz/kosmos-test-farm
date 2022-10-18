import { Container, Graphics } from "pixi.js";

export class ProgressBar extends Container {

  private bar: Container
  private fill: Graphics
  private fillColor: number
  private completionFillColor: number

  constructor(fillColor = 0xFFFFFF, completionFillColor = 0x00FF00) {
    super();

    const length = 12
    const thickness = 1
    this.fillColor = fillColor
    this.completionFillColor = completionFillColor

    this.fill = new Graphics()
    this.fill.beginFill(0xFFFFFF, 1)
    this.fill.drawRect(0, 0, length, thickness)
    this.fill.endFill()
    this.fill.scale.x = 0

    this.bar = new Container()
    this.bar.addChild(this.fill)
    this.bar.position.x -= length / 2
    this.addChild(this.bar)
  }

  setProgress(percent: number): void {
    this.fill.scale.x = percent
    if (percent === 1) {
      this.fill.tint = this.completionFillColor
    } else {
      this.fill.tint = this.fillColor
    }
  }
}
