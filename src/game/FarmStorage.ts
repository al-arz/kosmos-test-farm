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
}
