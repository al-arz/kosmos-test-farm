import { Container, utils } from "pixi.js";
import { BasicProducer, ConsumingProducer, IConsumer, IProducer } from "../game/Entities";
import { FarmPlot } from "../game/FarmPlot";
import { ProducerSprite } from "./ProducerSprite";
import { TileSprite } from "./TileSprite";

export class FarmPlotView extends Container<TileSprite> {
  entitySprites: Array<ProducerSprite<BasicProducer | ConsumingProducer>> = []

  constructor(plot: FarmPlot, events: utils.EventEmitter) {
    super()

    this.interactive = true

    plot.tiles.forEach(t => {
      const tileSprite = new TileSprite(t)

      tileSprite.anchor.set(0.5)
      tileSprite.interactive = true
      tileSprite.scale.set(6)
      tileSprite.position.set(t.position.col * 16 * 6, t.position.row * 16 * 6)

      tileSprite.on('pointertap', () => {
        console.log("tap on tile", t.id, t.position)
        t.contents.forEach(e => {
          if (e.harvestReady) {
            const producer = (e as IProducer)
            const harvest = producer.harvest()
            console.log("harvested", harvest)
            events.emit("harvested", harvest)
          }
          // if (e.consumptionTimer != undefined) {
          //   const consumer = (e as IConsumer)
          //   if (this.storage[consumer.input] > 0) {
          //     this.storage[consumer.input]--
          //     this.updateStorageInterface(this.storageView, this.storage)
          //     consumer.supply(consumer.input)
          //   }
          // }
        })
      })

      this.addChild(tileSprite)
    })
  }
}
