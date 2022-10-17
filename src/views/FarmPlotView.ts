import { Container } from "pixi.js";
import { events } from "../events";
import { BasicProducer, ConsumingProducer, IConsumer, IProducer } from "../game/Entities";
import { FarmPlot } from "../game/FarmPlot";
import { Tile } from "../game/Tile";
import { ProducerSprite } from "./ProducerSprite";
import { TileSprite } from "./TileSprite";

export class FarmPlotView extends Container<TileSprite> {
  entitySprites: Array<ProducerSprite<BasicProducer | ConsumingProducer>> = []

  constructor(plot: FarmPlot) {
    super()

    this.interactive = true

    plot.tiles.forEach(t => {
      const tileSprite = new TileSprite(t)

      tileSprite.on('pointertap', this.tapOnTile.bind(this, t))

      this.addChild(tileSprite)
    })
  }

  tapOnTile(t: Tile) {
    console.log("tap on tile", t.id, t.position)
    t.contents.forEach(e => {
      if (e.harvestReady) {
        const producer = (e as IProducer)
        const harvest = producer.harvest()
        console.log("harvested", harvest)
        events.emit("harvested", harvest)
      }
      if (e.consumptionTimer != undefined) {
        const consumer = (e as IConsumer)
        // if (this.storage[consumer.input] > 0) {
        // this.storage[consumer.input]--
        // this.updateStorageInterface(this.storageView, this.storage)
        consumer.supply(consumer.input)
        // }
      }
    })
  }
}
