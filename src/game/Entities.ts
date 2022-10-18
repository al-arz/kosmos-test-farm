import { ProgressTimer } from "./ProgressTimer"

import producers from "../data/producers.json";
import products from "../data/products.json";

export type ProductType = keyof typeof products
export type ProducerType = keyof typeof producers
export type ProducersJSONValues = typeof producers[ProducerType]

export type ProducerConfig = {
  type: ProducerType
  consumes?: {
    product: ProductType
    period: number
  },
  yields: {
    product: ProductType
    period: number
  }
}

export type SomeProducer = BasicProducer | ConsumingProducer

export function isConsumingProducer(entity: SomeProducer): entity is ConsumingProducer {
  return (entity as ConsumingProducer).input !== undefined;
}

export interface IProducer {
  productionTimer: ProgressTimer
  output: ProductType
  update(deltaMS: number): void
  harvest(): ProductType
}

export interface IConsumer {
  consumptionTimer: ProgressTimer
  input: ProductType
  update(ddeltaMS: number): void
  supply(input: ProductType): void
}

export class BasicProducer implements IProducer {
  productionTimer: ProgressTimer
  output: ProductType
  harvestReady: boolean = false

  constructor(config: ProducerConfig) {
    this.productionTimer = new ProgressTimer(config.yields.period)
    this.output = config.yields.product
  }

  update(deltaMS: number): void {
    this.advanceProduction(deltaMS)
  }

  advanceProduction(deltaMS: number) {
    if (!this.harvestReady) {
      this.productionTimer.advance(deltaMS)
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

  constructor(config: ProducerConfig) {
    this.productionTimer = new ProgressTimer(config.yields.period)
    this.consumptionTimer = new ProgressTimer(config.consumes.period)
    this.consumptionTimer.forceComplete()
    this.input = config.consumes.product
    this.output = config.yields.product
  }

  update(deltaMS: number) {
    if (this.supplied) {
      this.advanceConsumption(deltaMS)
      this.advanceProduction(deltaMS)
    }
  }

  advanceConsumption(deltaMS: number) {
    this.consumptionTimer.advance(deltaMS)
    if (this.consumptionTimer.isComplete) {
      this.supplied = false
    }
  }

  advanceProduction(deltaMS: number) {
    if (!this.harvestReady) {
      this.productionTimer.advance(deltaMS)
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
