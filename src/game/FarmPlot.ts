import { IConsumer, IProducer } from "./Entities"
import { Tile } from "./Tile"

export type FarmPlotConfig = {
  shape: "square" // "rectangle" | "circle" | "other"?
  size?: number
}

export class FarmPlot {
  configuration: FarmPlotConfig
  tiles: Tile[]
  entities: Array<IProducer | IConsumer> = []

  constructor(configuration: FarmPlotConfig) {
    this.configuration = configuration

    switch (configuration.shape) {
      case "square":
        this.tiles = FarmPlot.buildSquarePlot(configuration.size)
        break;
      default:
        this.tiles = []
        break;
    }
  }

  static buildSquarePlot(size: number = 8) {
    const tiles = []

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const tile = new Tile({
          row: row,
          col: col,
        })
        tiles.push(tile)
      }
    }
    return tiles
  }
}
