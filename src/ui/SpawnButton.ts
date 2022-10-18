import { Sprite, Texture } from "pixi.js"

export class SpawnButton extends Sprite {
  // Constrain with union from spriteAssets?
  constructor(assetName: string) {
    super(Texture.from(assetName))

    this.anchor.set(0.5, 0.5)
    this.scale.set(4)
    this.interactive = true
    this.buttonMode = true
  }
}
