export class ProgressTimer {
  readonly period: number
  private _timePassed: number
  constructor(period: number, initialTime = 0) {
    this.period = period
    this._timePassed = initialTime
  }

  advance(deltaMS: number) {
    this._timePassed += deltaMS
  }

  reset() {
    this._timePassed = 0
  }

  forceComplete() {
    this._timePassed = this.period
  }

  get timePassed() {
    return this._timePassed
  }

  get progress() {
    return Math.min(1, this.timePassed / this.period)
  }

  get isComplete() {
    return this._timePassed >= this.period
  }
}
