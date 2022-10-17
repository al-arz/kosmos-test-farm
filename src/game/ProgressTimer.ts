export class ProgressTimer {
  readonly period: number
  private _timePassed: number
  constructor(period: number, initialTime: number = 0) {
    this.period = period
    this._timePassed = initialTime
  }

  advance(dt: number) {
    this._timePassed += dt
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
