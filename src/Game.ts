import { Application, Loader, IApplicationOptions, Container } from "pixi.js";
import { events } from "./events";
import { spriteAssets } from "./assets";
import { FarmPlot } from "./game/FarmPlot";
import { FarmPlotView } from "./views/FarmPlotView";
import { FarmStorage } from "./game/FarmStorage";
import { FarmStorageView } from "./views/FarmStorageView";
import { SpawnButton } from "./ui/SpawnButton";
import producers from "./data/producers.json";
import products from "./data/products.json";

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

    this.app.ticker.add((dt) => {
      this.farmPlot.update(dt)
    })

    events.on("spawn-entity", this.farmPlot.spawnEntity, this.farmPlot)
    events.on("harvested", this.farmStorage.storeProduct, this.farmStorage)

    console.log("game objects set up")
  }

  addSpawnButtons() {
    const buttonsContainer = new Container()

    producers.forEach(p => {
      const btn = new SpawnButton(p.name)
      btn.y = buttonsContainer.height
      buttonsContainer.addChild(btn)
      btn.on("pointertap", () => {
        events.emit("spawn-entity", p)
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
