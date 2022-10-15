import { Application, Loader, Sprite, settings, SCALE_MODES, IApplicationOptions } from "pixi.js";
import { spriteAssets } from "./assets";

export class Game {
  app: Application

  constructor(options: IApplicationOptions) {
    settings.SCALE_MODE = SCALE_MODES.NEAREST

    this.app = new Application(options)

    Loader.shared.add(Object.values(spriteAssets))
    Loader.shared.onComplete.once(this.onAssetsLoad, this)
    Loader.shared.load()
    console.log("Loading assets")
  }

  onAssetsLoad() {
    console.log("Assets loaded")

    this.makeSprites()
  }

  makeSprites() {
    let offsetX = 0
    let offsetY = 0
    let maxHeight = 0
    Object.values(spriteAssets).forEach(asset => {
      const sprite = Sprite.from(asset.name)

      sprite.x = offsetX;
      sprite.y = offsetY;

      sprite.scale.set(4)

      maxHeight = sprite.height > maxHeight ? sprite.height : maxHeight

      this.app.stage.addChild(sprite);

      offsetX += sprite.width
      if (offsetX > this.app.screen.width) {
        offsetX = 0
        offsetY += maxHeight
        maxHeight = 0
      }
    })
  }
}