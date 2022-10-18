import { FarmPlotView } from "../views/FarmPlotView"
import { ProducerSprite } from "../views/ProducerSprite"
import { TileSprite } from "../views/TileSprite"
import { BasicProducer, ConsumingProducer, IConsumer, IProducer } from "./Entities"
import { Tile } from "./Tile"

export type FarmPlotConfig = {
  shape: "square" // "rectangle" | "circle" | "other"?
  size?: number
}

export class FarmPlot {
  configuration: FarmPlotConfig
  tiles: Tile[]
  entities: Array<IProducer | IConsumer> = []
  view: FarmPlotView

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

    this.view = new FarmPlotView(this)
  }

  update(deltaMS: number) {
    this.entities.forEach(e => {
      e.update(deltaMS)
    })

    this.view.entitySprites.forEach(s => {
      s.update()
    })
  }

  spawnEntity(p) {
    const tile = this.view.children.find(tileSprite => tileSprite.data.isEmpty)
    if (!tile) return

    let entity, sprite
    if (p.consumes) {
      entity = new ConsumingProducer(p)
    } else {
      entity = new BasicProducer(p)
    }

    sprite = new ProducerSprite(entity, p.name)
    this.entities.push(entity)
    tile.data.addEntity(entity)

    this.view.entitySprites.push(sprite)
    tile.addChild(sprite)
  }

  placeOnTile(entity: IProducer, sprite: ProducerSprite, tileSprite: TileSprite) {
    this.entities.push(entity)
    tileSprite.data.addEntity(entity)
    tileSprite.buttonMode = true
    this.view.entitySprites.push(sprite)
    sprite.position.set(0, 0)
    sprite.scale.set(0.5)
    sprite.alpha = 1
    tileSprite.addChild(sprite)
  }

  getNewEntity(p) {
    if (p.consumes) {
      return new ConsumingProducer(p)
    } else {
      return new BasicProducer(p)
    }
  }
}
