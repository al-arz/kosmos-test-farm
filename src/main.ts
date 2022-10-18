import { settings, SCALE_MODES } from "pixi.js";
import { Game } from "./Game";

// to get pixi.js devtools to work
import * as PIXI from "pixi.js";
window.PIXI = PIXI

settings.SCALE_MODE = SCALE_MODES.NEAREST // pixel art sprites should stay crisp
const size = [1280, 900];
const game = new Game({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x547e64,
  width: size[0],
  height: size[1]
});

const ratio = size[0] / size[1];

function resize() {
  let w, h
  if (window.innerWidth / window.innerHeight >= ratio) {
    w = Math.min(size[1], window.innerHeight) * ratio;
    h = Math.min(size[1], window.innerHeight);
  } else {
    w = Math.min(size[0], window.innerWidth);
    h = Math.min(size[0], window.innerWidth) / ratio;
  }
  game.app.renderer.view.style.width = w + 'px';
  game.app.renderer.view.style.height = h + 'px';

  console.log(game.app.screen.width, game.app.screen.height)
}
window.onresize = resize
resize()
