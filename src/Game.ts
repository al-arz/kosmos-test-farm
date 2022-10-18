import { Application, Loader, IApplicationOptions, Container, InteractionEvent } from "pixi.js";
import { events } from "./events";
import { spriteAssets } from "./assets";
import { FarmPlot } from "./game/FarmPlot";
import { ProducerConfig } from "./game/Entities";
import { FarmStorage } from "./game/FarmStorage";
import { FarmPlotView } from "./views/FarmPlotView";
import { FarmStorageView } from "./views/FarmStorageView";
import { TileSprite } from "./views/TileSprite";
import { SpawnButton } from "./ui/SpawnButton";
import { DragGhost } from "./ui/DragGhost";
import producers from "./data/producers.json";

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

    // pass products
    this.farmStorage = new FarmStorage()
    this.placeStorageView(this.farmStorage.view)

    this.addSpawnButtons(Object.values(producers) as Array<ProducerConfig>)

    this.app.ticker.add((_) => {
      this.farmPlot.update(this.app.ticker.deltaMS)
    })

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

  addSpawnButtons(configs: ProducerConfig[]) {
    const buttonsContainer = new Container()

    configs.forEach(p => {
      const btn = new SpawnButton(p.type)
      btn.y = buttonsContainer.height
      buttonsContainer.addChild(btn)

      // needs decoupling from farmPlot
      btn.on("pointerdown", (e: InteractionEvent) => {
        const ghost = new DragGhost(p.type)
        this.app.stage.addChild(ghost)
        ghost.setDragOffset(e.data, btn)
        ghost.onDragStart(e)

        const onDragEnd = () => {
          ghost.onDragEnd()
          this.farmPlot.view.cancelSelection()
        }
        ghost
          .on('pointermove', (e) => {
            this.farmPlot.view.findOverlap(e, (t: TileSprite) => t.data.isEmpty)
            ghost.onDragMove(e)
          })
          .on('pointerup', () => {
            const targetTile = this.farmPlot.view.findOverlap(e, (t: TileSprite) => t.data.isEmpty)
            if (targetTile) {
              this.farmPlot.spawnOnTile(targetTile, p)
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
