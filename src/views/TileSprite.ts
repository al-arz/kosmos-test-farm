import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { spriteAssets } from "../assets";
import { events } from "../events";
import { Tile } from "../game/Tile";

export class TileSprite extends Sprite {
  data: Tile
  size = 3

  constructor(data: Tile) {
    super(Texture.from(spriteAssets.tile.name))
    this.data = data

    this.anchor.set(0.5)
    this.scale.set(this.size)
    this.interactive = true
    this.on("pointerdown", this.onPointerDown, this)
  }

  onPointerDown(e: InteractionEvent) {
    const firstEntity = this.data.contents[0]
    if (firstEntity && firstEntity.harvestReady) {
      events.emit("harvest-attempt", { event: e, entity: firstEntity, tileSprite: this })
    }
  }
}
