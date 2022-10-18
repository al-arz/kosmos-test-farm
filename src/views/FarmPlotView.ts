import { Container, InteractionEvent } from "pixi.js";
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

  findOverlap(e: InteractionEvent) {
    let nearest = this.tileSprites[0]
    const pos0 = e.data.getLocalPosition(nearest)
    let minDistSq = pos0.x * pos0.x + pos0.y * pos0.y

    this.tileSprites.forEach(t => {
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
