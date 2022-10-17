import tileSprite from "./assets/tile.png"
import wheatSprite from "./assets/wheat.png"
import chickenSprite from "./assets/chicken.png"
import cowSprite from "./assets/cow.png"
import eggSprite from "./assets/egg.png"
import milkSprite from "./assets/milk.png"

export const spriteAssets = {
  tile: { name: 'tile', url: tileSprite },
  wheat: { name: 'wheat', url: wheatSprite },
  chicken: { name: 'chicken', url: chickenSprite },
  cow: { name: 'cow', url: cowSprite },
  egg: { name: 'egg', url: eggSprite },
  milk: { name: 'milk', url: milkSprite },
} as const
