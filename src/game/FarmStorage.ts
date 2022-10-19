import { events } from "../events";
import { ProductType } from "./Entities";

export class FarmStorage {
  products: { [key in ProductType]: number }

  constructor() {
    this.products = {
      wheat: 0,
      egg: 0,
      milk: 0,
    }
  }

  storeProduct(p: ProductType) {
    this.products[p]++
    events.emit("storage-update", this)
  }

  retrieveProduct(p: ProductType) {
    this.products[p]--
    events.emit("storage-update", this)
  }

  has(p: ProductType) {
    return this.products[p]
  }
}
