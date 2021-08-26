import * as PIXI from 'pixi.js';
import { log } from './log';
import { Node } from './node';
import { Theme } from './theme';

export class UI extends Node {
  private domContainer?: HTMLElement;
  private pixi: PIXI.Application;

  constructor(theme?: Theme) {
    super(theme);
    const pixi = (this.pixi = new PIXI.Application({
      width: 1,
      height: 1,
      backgroundColor: 0xffffff,
    }));
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    pixi.stage.addChild(this.container);
    pixi.ticker.add(this.onUpdate);
    log('New UI');
  }

  static create(domContainer: HTMLElement, theme?: Theme): Promise<UI> {
    return new Promise(resolve => {
      const ui = new UI(theme);
      ui.theme.preload().then(() => {
        ui.mount(domContainer);
        resolve(ui);
      });
    });
  }

  createAppreanceFromTheme() {}

  mount(domContainer: HTMLElement) {
    this.domContainer = domContainer;
    new ResizeObserver(this.onContainerResize).observe(domContainer);
    domContainer.appendChild(this.pixi.view);
    log('UI Mounting');
  }

  onContainerResize = () => {
    const { domContainer, pixi } = this;
    if (domContainer) {
      const { offsetWidth: width, offsetHeight: height } = domContainer;
      this.onResize(width, height);
      pixi.renderer.resize(width, height);
      pixi.render();
    }
  };

  onUpdate = () => {};
}
