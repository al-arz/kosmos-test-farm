import { Game } from "./Game";

const game = new Game({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x547e64,
  resizeTo: window,
});
