import { Container, InteractionEvent } from "pixi.js";
import { ProducerConfig } from "../Game";
import { SomeProducer } from "../game/Entities";
import { FarmPlot } from "../game/FarmPlot";
import { ProducerSprite } from "./ProducerSprite";
import { TileSprite } from "./TileSprite";

export class FarmPlotView extends Container<TileSprite> {
  entitySprites: Array<ProducerSprite> = []
  tileSprites: Array<TileSprite> = []
  selectedTile: TileSprite | null = null

  constructor(plot: FarmPlot) {
    super()

    this.interactive = true

    plot.tiles.forEach(t => {
      const tileSprite = new TileSprite(t)
      this.tileSprites.push(tileSprite)
      this.addChild(tileSprite)
    })
  }

  displayOnTile(entity: SomeProducer, config: ProducerConfig, tileSprite: TileSprite) {
    const sprite = new ProducerSprite(entity, config.type)
    this.entitySprites.push(sprite)
    tileSprite.addChild(sprite)
    tileSprite.buttonMode = true
  }

  findOverlap(e: InteractionEvent, filter?) {
    let subset = this.tileSprites
    if (filter) {
      console.log('filtered')
      subset = subset.filter(filter)
      if (subset.length === 0) return null
    }

    let nearest = subset[0]
    const pos0 = e.data.getLocalPosition(nearest)
    let minDistSq = pos0.x * pos0.x + pos0.y * pos0.y

    subset.forEach(t => {
      const pos = e.data.getLocalPosition(t)
      const distSq = pos.x * pos.x + pos.y * pos.y
      if (minDistSq > distSq) {
        minDistSq = distSq
        nearest = t
      }
    })

    if (this.selectedTile) {
      this.selectedTile.alpha = 1
    }
    if (minDistSq < 300) {
      nearest.alpha = 0.5
      this.selectedTile = nearest
    } else {
      this.selectedTile = null

    }
    return this.selectedTile
  }

  cancelSelection() {
    if (this.selectedTile) {
      this.selectedTile.alpha = 1
    }
    this.selectedTile = null
  }
}
