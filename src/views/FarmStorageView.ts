import { Container } from "pixi.js";
import { ProductType } from "../game/Entities";
import { FarmStorage } from "../game/FarmStorage";
import { StorageEntryView } from "./StorageEntryView";

export class FarmStorageView extends Container<StorageEntryView>{
  storage: FarmStorage
  constructor(storage: FarmStorage) {
    super()
    this.storage = storage

    const storedProducts = Object.keys(storage) as ProductType[]
    storedProducts.forEach(p => {
      console.log("adding storage for", p)
      const entry: StorageEntryView = new StorageEntryView(p)
      entry.y = this.height
      this.addChild(entry)
    })
  }

  update() {
    this.children.forEach(entry => {
      entry.label.text = this.storage[entry.productType]
    })
  }
}
