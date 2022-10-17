import { Container, Sprite, Text } from "pixi.js"
import { ProductType } from "../game/Entities"

export class StorageEntryView extends Container {
  icon: Sprite
  label: Text
  productType: ProductType

  constructor(type: ProductType) {
    super()
    this.icon = Sprite.from(type)
    this.label = new Text("0", { fill: 0x2e222f })
    this.productType = type

    this.icon.anchor.set(0.5)
    this.icon.scale.set(4)
    this.icon.interactive = true
    this.label.position.x = - this.icon.width

    this.addChild(this.icon)
    this.addChild(this.label)
  }
}
