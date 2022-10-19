import { Container } from "pixi.js";
import { events } from "../events";
import { ProductType } from "../game/Entities";
import { FarmStorage } from "../game/FarmStorage";
import { StorageEntryView } from "./StorageEntryView";

export class FarmStorageView extends Container<StorageEntryView>{
  storage: FarmStorage
  size = 4

  constructor(storage: FarmStorage) {
    super()
    this.storage = storage

    const storedProducts = Object.keys(storage.products) as ProductType[]
    let yOffset = 0
    storedProducts.forEach(p => {
      const entry: StorageEntryView = new StorageEntryView(p, this.size)
      entry.icon.on('pointertap', () => {
        events.emit("sell-attempt", p)
      })
      entry.y = yOffset
      yOffset += 32 * this.size
      this.addChild(entry)
    })
  }

  update(storage: FarmStorage) {
    this.children.forEach(entry => {
      entry.label.text = storage.products[entry.productType]
    })
  }
}
