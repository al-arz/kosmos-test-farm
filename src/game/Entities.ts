import { ProgressTimer } from "./ProgressTimer"

export type ProducerType = "wheat" | "chicken" | "cow"
export type ProductType = "wheat" | "egg" | "milk"

export type SomeProducer = BasicProducer | ConsumingProducer

export function isConsumingProducer(entity: SomeProducer): entity is ConsumingProducer {
  return (entity as ConsumingProducer).input !== undefined;
}

export type BasicProducerConfig = {
  name: ProducerType
  yields: {
    product: ProductType
    period: number
  }
}

export type ConsumingProducerConfig = BasicProducerConfig & {
  consumes: {
    product: ProductType
    period: number
  }
}

export interface IProducer {
  productionTimer: ProgressTimer
  output: ProductType
  update(dt: number): void
  harvest(): ProductType
}

export interface IConsumer {
  consumptionTimer: ProgressTimer
  input: ProductType
  update(dt: number): void
  supply(input: ProductType): void
}

export class BasicProducer implements IProducer {
  productionTimer: ProgressTimer
  output: ProductType
  harvestReady: boolean = false

  constructor(config: BasicProducerConfig) {
    this.productionTimer = new ProgressTimer(config.yields.period)
    this.output = config.yields.product
  }

  update(dt: number): void {
    this.advanceProduction(dt)
  }

  advanceProduction(dt: number) {
    if (!this.harvestReady) {
      this.productionTimer.advance(dt)
      if (this.productionTimer.isComplete) {
        this.harvestReady = true
      }
    }
  }

  harvest() {
    this.harvestReady = false
    this.productionTimer.reset()
    return this.output
  }
}

export class ConsumingProducer implements IConsumer, IProducer {
  consumptionTimer: ProgressTimer
  productionTimer: ProgressTimer
  output: ProductType
  input: ProductType
  supplied: boolean = false
  harvestReady: boolean = false

  constructor(config: ConsumingProducerConfig) {
    this.productionTimer = new ProgressTimer(config.yields.period)
    this.consumptionTimer = new ProgressTimer(config.consumes.period)
    this.consumptionTimer.forceComplete()
    this.input = config.consumes.product
    this.output = config.yields.product
  }

  update(dt: number) {
    if (this.supplied) {
      this.advanceConsumption(dt)
      this.advanceProduction(dt)
    }
  }

  advanceConsumption(dt: number) {
    this.consumptionTimer.advance(dt)
    if (this.consumptionTimer.isComplete) {
      this.supplied = false
    }
  }

  advanceProduction(dt: number) {
    if (!this.harvestReady) {
      this.productionTimer.advance(dt)
      if (this.productionTimer.isComplete) {
        this.harvestReady = true
      }
    }
  }

  harvest() {
    this.harvestReady = false
    this.productionTimer.reset()
    return this.output
  }

  supply(input: ProductType) {
    if (this.input === input) {
      this.supplied = true
      this.consumptionTimer.reset()
    }
  }
}
