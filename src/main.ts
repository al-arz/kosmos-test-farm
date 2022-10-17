import { settings, SCALE_MODES } from "pixi.js";
import { Game } from "./Game";

settings.SCALE_MODE = SCALE_MODES.NEAREST // pixel art sprites should stay crisp

new Game({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x547e64,
  resizeTo: window,
});
