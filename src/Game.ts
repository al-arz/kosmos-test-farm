import { Application, Loader, IApplicationOptions, Container, InteractionEvent, DisplayObject, Text } from "pixi.js";
import { events } from "./events";
import { spriteAssets } from "./assets";
import { FarmPlot } from "./game/FarmPlot";
import { ProducerConfig, ProductType } from "./game/Entities";
import { FarmStorage } from "./game/FarmStorage";
import { FarmPlotView } from "./views/FarmPlotView";
import { FarmStorageView } from "./views/FarmStorageView";
import { TileSprite } from "./views/TileSprite";
import { SpawnButton } from "./ui/SpawnButton";
import { DragGhost } from "./ui/DragGhost";
import producers from "./data/producers.json";
import products from "./data/products.json";

export class Game {
  app: Application

  farmPlot!: FarmPlot
  farmPlotView!: FarmPlotView
  farmStorage!: FarmStorage
  farmStorageView!: FarmStorageView
  funds = 0
  fundsLabel!: Text

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
    this.farmPlotView = new FarmPlotView(this.farmPlot)
    this.placePlotView(this.farmPlotView)

    // pass products?
    this.farmStorage = new FarmStorage()
    this.farmStorageView = new FarmStorageView(this.farmStorage)
    this.placeStorageView(this.farmStorageView)

    this.addSpawnButtons(Object.values(producers) as Array<ProducerConfig>)

    this.fundsLabel = new Text('', { fill: 0xFFFFFF })
    this.updateFundsLabel(this.funds)
    this.app.stage.addChild(this.fundsLabel)

    this.app.ticker.add((_) => {
      this.farmPlot.update(this.app.ticker.deltaMS)
      this.farmPlotView.update()
    })

    events.on("harvested", this.farmStorage.storeProduct, this.farmStorage)
    events.on("storage-update", (s: FarmStorage) => {
      this.farmStorageView.update(s)
    })
    events.on("sell-attempt", (p: ProductType) => {
      if (products[p].sellPrice !== undefined && this.farmStorage.has(p) > 0) {
        this.farmStorage.retrieveProduct(p)
        this.increaseFunds(products[p].sellPrice)
      }
    })
    events.on("harvest-attempt", ({ event, entity, tileSprite }) => {
      const ghost = new DragGhost(entity.output)
      ghost.setDragOffset(event.data, tileSprite)
      this.app.stage.addChild(ghost)
      ghost.onDragStart(event)
      ghost.on("pointermove", (e) => {
        this.farmPlotView.findOverlap(e, (t: TileSprite) => {
          return !t.data.isEmpty && (t.data.contents[0].input === entity.output)
        })
        ghost.onDragMove(e)
      })
      ghost.on("pointerup", (e) => {
        const target = this.farmPlotView.findOverlap(e, (t: TileSprite) => {
          return !t.data.isEmpty && (t.data.contents[0].input === entity.output)
        })
        ghost.onDragEnd()
        if (target) {
          target.data.contents[0].supply(entity.output)
          this.farmPlotView.cancelSelection()
          entity.harvest()
        } else {
          events.emit("harvested", entity.harvest())
        }
      })
    })

    console.log("game objects set up")
  }

  addSpawnButtons(configs: ProducerConfig[]) {
    const buttonsContainer = new Container()

    let yOffset = 0
    configs.forEach(p => {
      const btn = new SpawnButton(p.type)
      btn.y = yOffset
      yOffset += 32 * 3
      buttonsContainer.addChild(btn)

      // needs decoupling from farmPlot
      btn.on("pointerdown", (e: InteractionEvent) => {
        const ghost = new DragGhost(p.type)
        this.app.stage.addChild(ghost)
        ghost.setDragOffset(e.data, btn)
        ghost.onDragStart(e)

        const onDragEnd = () => {
          ghost.onDragEnd()
          this.farmPlotView.cancelSelection()
        }
        ghost
          .on('pointermove', (e) => {
            this.farmPlotView.findOverlap(e, (t: TileSprite) => t.data.isEmpty)
            ghost.onDragMove(e)
          })
          .on('pointerup', () => {
            const targetTile = this.farmPlotView.findOverlap(e, (t: TileSprite) => t.data.isEmpty)
            if (targetTile) {
              const entity = this.farmPlot.spawnOnTile(targetTile, p)
              this.farmPlotView.displayOnTile(entity, p, targetTile)
            }
            onDragEnd()
          })
          .on('pointerupoutside', onDragEnd)
      })
    })

    buttonsContainer.position.set(
      0,
      (this.app.screen.height - buttonsContainer.height) / 2
    )

    this.offsetBounds(buttonsContainer)
    this.app.stage.addChild(buttonsContainer)
  }

  placeStorageView(storageView: FarmStorageView) {
    storageView.position.set(
      this.app.screen.width - storageView.width,
      (this.app.screen.height - storageView.height) / 2
    )

    this.offsetBounds(storageView)
    this.app.stage.addChild(storageView)
  }

  placePlotView(plotView: FarmPlotView) {
    plotView.position.set(
      (this.app.screen.width - plotView.width) / 2,
      (this.app.screen.height - plotView.height) / 2
    )

    this.offsetBounds(plotView)
    this.app.stage.addChild(plotView)
  }

  increaseFunds(amount: number) {
    this.funds += amount
    this.updateFundsLabel(this.funds)
  }

  updateFundsLabel(amount: number) {
    this.fundsLabel.text = '$' + amount
    this.fundsLabel.position.set(
      (this.app.screen.width - this.fundsLabel.width) / 2,
      32
    )
  }

  // Setting container childrens' anchor offsets container bounds
  // Here we're adjusting for that. Yes, it's ugly
  offsetBounds(obj: DisplayObject) {
    const bounds = obj.getBounds()
    obj.x += obj.x - bounds.left
    obj.y += obj.y - bounds.top
  }
}
