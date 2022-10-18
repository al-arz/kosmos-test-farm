import { Application, Loader, IApplicationOptions, Container, InteractionEvent, InteractionData, DisplayObject } from "pixi.js";
import { events } from "./events";
import { spriteAssets } from "./assets";
import { FarmPlot } from "./game/FarmPlot";
import { FarmPlotView } from "./views/FarmPlotView";
import { FarmStorage } from "./game/FarmStorage";
import { FarmStorageView } from "./views/FarmStorageView";
import { SpawnButton } from "./ui/SpawnButton";
import producers from "./data/producers.json";
import products from "./data/products.json";
import { ProducerSprite } from "./views/ProducerSprite";
import { IProducer, isConsumingProducer, ProducerType, ProductType } from "./game/Entities";
import { DragGhost } from "./ui/DragGhost";
import { TileSprite } from "./views/TileSprite";

export class Game {
  app: Application

  farmPlot!: FarmPlot
  farmStorage!: FarmStorage

  constructor(options: IApplicationOptions) {
    this.app = new Application(options)

    Loader.shared.add(Object.values(spriteAssets))
    Loader.shared.onComplete.once(this.onAssetsLoad, this)
    Loader.shared.load()
  }

  onAssetsLoad() {
    console.log("assets loaded")
    this.setup()
  }

  setup() {
    this.farmPlot = new FarmPlot({ shape: "square", size: 8 })
    this.placePlotView(this.farmPlot.view)

    this.farmStorage = new FarmStorage()
    this.placeStorageView(this.farmStorage.view)

    this.addSpawnButtons()

    this.app.ticker.add((_) => {
      this.farmPlot.update(this.app.ticker.deltaMS)
    })

    events.on("spawn-entity", this.farmPlot.spawnEntity, this.farmPlot)
    events.on("harvested", this.farmStorage.storeProduct, this.farmStorage)
    events.on("harvest-attempt", ({ event, entity, tileSprite }) => {
      const ghost = new DragGhost(entity.output)
      ghost.setDragOffset(event.data, tileSprite)
      this.app.stage.addChild(ghost)
      ghost.onDragStart(event)
      ghost.on("pointermove", (e) => {
        this.farmPlot.view.findOverlap(e, (t: TileSprite) => {
          return !t.data.isEmpty && (t.data.contents[0].input === entity.output)
        })
        ghost.onDragMove(e)
      })
      ghost.on("pointerup", (e) => {
        const target = this.farmPlot.view.findOverlap(e, (t: TileSprite) => {
          return !t.data.isEmpty && (t.data.contents[0].input === entity.output)
        })
        ghost.onDragEnd()
        if (target) {
          target.data.contents[0].supply(entity.output)
          this.farmPlot.view.cancelSelection()
          entity.harvest()
        } else {
          events.emit("harvested", entity.harvest())
        }
      })
    })

    console.log("game objects set up")
  }

  addSpawnButtons() {
    const buttonsContainer = new Container()

    producers.forEach(p => {
      const producerType = p.type as ProducerType
      const btn = new SpawnButton(producerType)
      btn.y = buttonsContainer.height
      buttonsContainer.addChild(btn)

      btn.on("pointerdown", (e: InteractionEvent) => {
        const ghost = new DragGhost(p.type as ProductType)
        this.app.stage.addChild(ghost)
        ghost.setDragOffset(e.data, btn)
        ghost.onDragStart(e)

        const onDragEnd = () => {
          ghost.onDragEnd()
          this.farmPlot.view.cancelSelection()
        }
        ghost
          .on('pointermove', (e) => {
            this.farmPlot.view.findOverlap(e, t => t.data.isEmpty)
            ghost.onDragMove(e)
          })
          .on('pointerup', () => {
            const targetTile = this.farmPlot.view.findOverlap(e, t => t.data.isEmpty)
            if (targetTile) {
              const entity = this.farmPlot.getNewEntity(p)
              const sprite = new ProducerSprite(entity, producerType)
              this.farmPlot.placeOnTile(entity, sprite, targetTile)
            }
            onDragEnd()
          })
          .on('pointerupoutside', onDragEnd)
      })
    })

    buttonsContainer.position.set(
      buttonsContainer.width,
      (this.app.screen.height - buttonsContainer.height) / 2
    )

    this.app.stage.addChild(buttonsContainer)
  }

  placeStorageView(storageView: FarmStorageView) {
    storageView.position.set(
      this.app.screen.width - storageView.width,
      (this.app.screen.height - storageView.height) / 2
    )

    this.app.stage.addChild(storageView)
  }

  placePlotView(plotView: FarmPlotView) {
    plotView.position.set(
      (this.app.screen.width - plotView.width) / 2,
      (this.app.screen.height - plotView.height) / 2
    )

    this.app.stage.addChild(plotView)
  }
}
