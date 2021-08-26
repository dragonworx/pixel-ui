import * as PIXI from 'pixi.js';
import { log } from './log';
import { Node } from './node';
import { ThemeElement } from './theme';

export class Panel extends Node {
  createAppreanceFromTheme() {
    const size = 10;
    log('Panel create appearance');
    this.addElement(
      ThemeElement.PanelBackground,
      new PIXI.NineSlicePlane(
        this.theme.texture(ThemeElement.PanelBackground),
        size,
        size,
        size,
        size,
      ),
    );
  }

  onResize(width: number, height: number) {
    super.onResize(width, height);
    this.sizeElement(ThemeElement.PanelBackground, width, height);
  }
}
