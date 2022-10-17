import { Application, Loader, settings, SCALE_MODES, IApplicationOptions, Container, utils } from "pixi.js";
import { spriteAssets } from "./assets";
import { FarmPlot } from "./game/FarmPlot";
import { BasicProducer, ConsumingProducer, ProductType } from "./game/Entities";
import { FarmStorage } from "./game/FarmStorage";
import { ProducerSprite } from "./views/ProducerSprite";
import { FarmStorageView } from "./views/FarmStorageView";
import { FarmPlotView } from "./views/FarmPlotView";
import { SpawnButton } from "./ui/SpawnButton";
import producers from "./data/producers.json";
import products from "./data/products.json";

export class Game {
  app: Application
  events: utils.EventEmitter

  farmPlot: FarmPlot
  farmPlotView: FarmPlotView

  farmStorage: FarmStorage
  farmStorageView: FarmStorageView

  constructor(options: IApplicationOptions) {
    settings.SCALE_MODE = SCALE_MODES.NEAREST // pixel art sprites should stay crisp

    this.app = new Application(options)
    this.events = new utils.EventEmitter()

    Loader.shared.add(Object.values(spriteAssets))
    Loader.shared.onComplete.once(this.onAssetsLoad, this)
    Loader.shared.load()
    console.log("loading assets")
  }

  onAssetsLoad() {
    console.log("assets loaded")

    this.farmPlot = new FarmPlot({ shape: "square", size: 8 })
    this.farmPlotView = this.createFarmPlotView(this.farmPlot)
    this.app.stage.addChild(this.farmPlotView)

    this.createSpawnButtons()

    this.farmStorage = new FarmStorage()
    this.farmStorageView = this.createStorageView(this.farmStorage)
    this.app.stage.addChild(this.farmStorageView)

    this.app.ticker.add((dt) => {
      this.farmPlot.entities.forEach(e => {
        e.update(dt)
      })

      this.farmPlotView.entitySprites.forEach(s => {
        s.update()
      })
    })

    this.events.on("harvested", this.storeProduct, this)
    this.events.on("spawn-entity", this.spawnEntity, this)
  }

  createFarmPlotView(plot: FarmPlot) {
    const plotContainer = new FarmPlotView(plot, this.events)

    plotContainer.position.set(
      (this.app.screen.width - plotContainer.width) / 2,
      (this.app.screen.height - plotContainer.height) / 2)

    return plotContainer
  }

  createSpawnButtons() {
    const buttonsContainer = new Container()

    producers.forEach(p => {
      const btn = new SpawnButton(p.name)
      btn.y = buttonsContainer.height
      buttonsContainer.addChild(btn)
      btn.on("pointertap", () => {
        this.events.emit("spawn-entity", p)
      })
    })

    buttonsContainer.position.set(
      buttonsContainer.width,
      (this.app.screen.height - buttonsContainer.height) / 2
    )

    this.app.stage.addChild(buttonsContainer)
  }

  createStorageView(storage: FarmStorage) {
    const storageView = new FarmStorageView(storage)

    storageView.position.set(
      this.app.screen.width - storageView.width,
      (this.app.screen.height - storageView.height) / 2
    )

    return storageView
  }

  spawnEntity(p) {
    const tile = this.farmPlotView.children.find(tileSprite => tileSprite.data.isEmpty)
    if (!tile) return

    let entity, sprite
    if (p.consumes) {
      entity = new ConsumingProducer(p)
      sprite = new ProducerSprite<ConsumingProducer>(entity, p.name)
    } else {
      entity = new BasicProducer(p)
      sprite = new ProducerSprite<BasicProducer>(entity, p.name)
    }

    this.farmPlot.entities.push(entity)
    tile.data.add(entity)

    this.farmPlotView.entitySprites.push(sprite)
    tile.addChild(sprite)
  }

  storeProduct(p: ProductType) {
    this.farmStorage.products[p]++
    console.log("farm storage", this.farmStorage)
    this.farmStorageView.update()
  }
}
