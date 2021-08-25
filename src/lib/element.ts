import * as PIXI from 'pixi.js';
import { Node } from './node';

export class Element extends Node {
  bg?: PIXI.NineSlicePlane;

  createAppreance() {
    const texture = this.theme.texture('panel');
    console.log(texture);
    const size = 10;
    const bg = (this.bg = new PIXI.NineSlicePlane(
      texture,
      size,
      size,
      size,
      size,
    ));
    this.container.addChild(bg);
  }

  onResize(width: number, height: number) {
    super.onResize(width, height);
    if (this.bg) {
      this.bg.width = width;
      this.bg.height = height;
    }
  }
}
