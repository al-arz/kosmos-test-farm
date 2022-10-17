import { IConsumer, IProducer } from "./Entities"

type TileCoords = {
  row: number
  col: number
}

export class Tile {
  readonly id: number
  readonly position: TileCoords
  readonly contents: Array<IProducer | IConsumer> = []

  private static id = 0

  constructor(position: TileCoords) {
    this.position = position
    this.id = Tile.id++
  }

  get isEmpty() {
    return this.contents.length === 0
  }

  add(entity: IProducer | IConsumer) {
    this.contents.push(entity)
  }
}
