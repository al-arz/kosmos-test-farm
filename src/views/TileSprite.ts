import { Sprite, Texture } from "pixi.js";
import { spriteAssets } from "../assets";
import { Tile } from "../game/Tile";

export class TileSprite extends Sprite {
  data: Tile

  constructor(data: Tile) {
    super(Texture.from(spriteAssets.tile.name))
    this.data = data

    this.anchor.set(0.5)
    this.interactive = true
    this.scale.set(6)
    this.position.set(data.position.col * 16 * 6, data.position.row * 16 * 6)
  }
}
