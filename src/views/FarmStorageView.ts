import { Container, InteractionEvent, Sprite } from "pixi.js";
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
      console.log("adding storage for", p)
      const entry: StorageEntryView = new StorageEntryView(p, this.size)
      entry.y = yOffset
      yOffset += 32 * this.size
      this.addChild(entry)
    })
  }

  update() {
    this.children.forEach(entry => {
      entry.label.text = this.storage.products[entry.productType]
    })
  }
}
