import { TileSprite } from "../views/TileSprite"
import { BasicProducer, ConsumingProducer, IProducer, ProducerConfig, SomeProducer } from "./Entities"
import { Tile } from "./Tile"

export type FarmPlotConfig = {
  shape: "square" // "rectangle" | "circle" | "other"?
  size?: number
}

export class FarmPlot {
  configuration: FarmPlotConfig
  tiles: Tile[]
  entities: Array<IProducer> = []

  static buildSquarePlot(size = 8) {
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

  update(deltaMS: number) {
    this.entities.forEach(e => {
      e.update(deltaMS)
    })
  }

  spawnOnTile(tile: TileSprite, conf: ProducerConfig): SomeProducer {
    let entity: SomeProducer
    if (conf.consumes === undefined) {
      entity = new BasicProducer(conf)
    } else {
      entity = new ConsumingProducer(conf)
    }

    tile.data.addEntity(entity)
    this.entities.push(entity)

    return entity
  }
}
