import { DisplayObject, InteractionData, InteractionEvent, IPoint, Point, Sprite, Texture } from "pixi.js";
import { ProducerType, ProductType } from "../game/Entities";

export class DragGhost extends Sprite {
  dragOffset: Point = new Point(0, 0)

  constructor(assetName: ProductType | ProducerType) {
    super(Texture.from(assetName))

    this.interactive = true
    this.anchor.set(0.5)
    this.scale.set(4)
  }

  setDragOffset(data: InteractionData, object: DisplayObject) {
    const globalPos = object.getGlobalPosition()
    this.dragOffset.set(data.global.x - globalPos.x, data.global.y - globalPos.y)
  }

  onDragStart(e: InteractionEvent) {
    this.alpha = 0.5;
    this.updatePosition(e)
  }

  onDragEnd() {
    this.destroy()
  }

  onDragMove(e: InteractionEvent) {
    this.updatePosition(e)
  }

  updatePosition(e: InteractionEvent) {
    const pos = e.data.getLocalPosition(this.parent)
    this.position.set(pos.x - this.dragOffset.x, pos.y - this.dragOffset.y)
  }
}
