import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { spriteAssets } from "../assets";
import { events } from "../events";
import { IConsumer, IProducer } from "../game/Entities";
import { Tile } from "../game/Tile";

export class TileSprite extends Sprite {
  data: Tile

  constructor(data: Tile) {
    super(Texture.from(spriteAssets.tile.name))
    this.data = data

    this.anchor.set(0.5)
    this.scale.set(6)
    this.position.set(
      data.position.col * 16 * 6,
      data.position.row * 16 * 6
    )
    this.interactive = true
    this.on("pointerdown", this.onPointerDown, this)
    // this.on("pointertap", this.onTap)
  }

  onPointerDown(e: InteractionEvent) {
    const firstEntity = this.data.contents[0]
    if (firstEntity && firstEntity.harvestReady) {
      events.emit("harvest-attempt", { event: e, entity: firstEntity, tileSprite: this })
    }
  }

  onTap() {
    console.log("tap on tile", this.data.id, this.data.position)
    this.data.contents.forEach(entity => {
      // Better call polymorphic method on entity instead
      if (entity.harvestReady) {
        const producer = (entity as IProducer)
        const harvest = producer.harvest()
        console.log("harvested", harvest)
        events.emit("harvested", harvest)
      }
      if (entity.consumptionTimer != undefined) {
        const consumer = (entity as IConsumer)
        // if (this.storage[consumer.input] > 0) {
        // this.storage[consumer.input]--
        // this.updateStorageInterface(this.storageView, this.storage)
        consumer.supply(consumer.input)
        // }
      }
    })
  }
}
