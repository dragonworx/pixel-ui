import * as PIXI from 'pixi.js';

export class DynamicTexture {
  renderTexture: PIXI.RenderTexture;
  renderer: PIXI.AbstractRenderer;
  graphics: PIXI.Graphics;

  constructor(
    readonly width: number,
    readonly height: number,
    scaleMode: PIXI.SCALE_MODES = PIXI.settings.SCALE_MODE,
    resolution: number = PIXI.settings.FILTER_RESOLUTION,
  ) {
    this.renderTexture = PIXI.RenderTexture.create({
      width,
      height,
      scaleMode,
      resolution,
    });
    this.renderer = PIXI.autoDetectRenderer();
    this.graphics = new PIXI.Graphics();
  }

  asTexture() {
    return this.renderTexture;
  }

  paint() {
    const { renderer, renderTexture, graphics } = this;
    renderer.render(graphics, { clear: false, renderTexture });
    return this;
  }

  drawObject(object: PIXI.DisplayObject, x: number = 0, y: number = 0) {
    const { renderer, renderTexture } = this;
    object.position.x = x;
    object.position.y = y;
    renderer.render(object, { clear: false, renderTexture });
    return this;
  }

  drawSprite(
    object: PIXI.Sprite,
    x: number = 0,
    y: number = 0,
    anchorX: number = 0,
    anchorY: number = 0,
  ) {
    const { renderer, renderTexture } = this;
    object.position.x = x;
    object.position.y = y;
    object.anchor.x = anchorX;
    object.anchor.y = anchorY;
    renderer.render(object, { clear: false, renderTexture });
    return this;
  }

  strokeStyle(color: number, width: number = 1, alpha: number = 1) {
    this.graphics.lineStyle(width, color, alpha);
    return this;
  }

  fillRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: number,
    alpha: number = 1,
  ) {
    const { graphics } = this;
    graphics
      .beginFill(fillColor, alpha)
      .drawRoundedRect(x, y, width, height, radius)
      .endFill();
    return this;
  }
}
