import { FarmStorageView } from "../views/FarmStorageView";
import { ProductType } from "./Entities";

export class FarmStorage {
  products: { [key in ProductType]: number }
  view: FarmStorageView

  constructor() {
    this.products = {
      wheat: 0,
      egg: 0,
      milk: 0,
    }

    this.view = new FarmStorageView(this)
  }

  storeProduct(p: ProductType) {
    this.products[p]++
    console.log("farm storage", this.products)
    this.view.update()
  }
}
