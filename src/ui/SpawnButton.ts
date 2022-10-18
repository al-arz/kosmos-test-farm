import { Sprite, Texture } from "pixi.js"
import { ProducerType } from "../game/Entities"

export class SpawnButton extends Sprite {
  constructor(assetName: ProducerType) {
    super(Texture.from(assetName))

    this.anchor.set(0.5, 0.5)
    this.scale.set(4)
    this.interactive = true
    this.buttonMode = true
  }
}
