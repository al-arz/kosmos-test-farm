import { Sprite, Texture } from "pixi.js";
import { ProgressBar } from "../ui/ProgressBar";
import { isConsumingProducer, ProducerType, SomeProducer } from "../game/Entities";

export class ProducerSprite extends Sprite {
  data: SomeProducer
  productionBar: ProgressBar
  consumptionBar?: ProgressBar

  constructor(data: SomeProducer, type: ProducerType) {
    super(Texture.from(type))
    this.data = data

    // this.scale.set(0.5)
    this.anchor.set(0.5, 0.5)

    //Builder pattern?
    this.productionBar = new ProgressBar(0xFFFFFF)
    this.productionBar.position.y = 14
    this.productionBar.scale.set(2)
    this.addChild(this.productionBar)

    if (isConsumingProducer(data)) {
      this.consumptionBar = new ProgressBar(0xF9C22B)
      this.consumptionBar.position.y = 12
      this.consumptionBar.scale.set(2)
      this.addChild(this.consumptionBar)
    }
  }

  update() {
    if (this.productionBar) {
      this.productionBar.setProgress(this.data.productionTimer.progress)
    }

    if (isConsumingProducer(this.data)) {
      if (this.consumptionBar) {
        this.consumptionBar.setProgress(1 - this.data.consumptionTimer.progress)
      }
    }
  }
}
