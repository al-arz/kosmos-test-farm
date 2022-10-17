import { Sprite, Texture } from "pixi.js";
import { spriteAssets } from "../assets";
import { Tile } from "../game/Tile";

export class TileSprite extends Sprite {
  data: Tile

  constructor(data: Tile) {
    super(Texture.from(spriteAssets.tile.name))
    this.data = data
  }
}
