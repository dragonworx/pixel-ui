import { EventEmitter } from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { DynamicTexture } from './dynamicTexture';
import { log } from './log';

export interface TextureAsset {
  name: string;
  url: string;
}

export const texture = (name: string, url: string): TextureAsset => ({
  name,
  url,
});

export enum ThemeElement {
  PanelBackground = 'panelBackground',
}

export abstract class Theme extends EventEmitter {
  loader: PIXI.Loader;
  textures: Map<string, PIXI.Texture<PIXI.Resource>> = new Map();

  constructor(baseUrl?: string) {
    super();
    this.loader = new PIXI.Loader(baseUrl);
  }

  get defaultTextureAssets(): TextureAsset[] {
    return [];
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.preload()
        .then(() => {
          this.initGraphics();
          resolve();
        })
        .catch(reject);
    });
  }

  protected preload(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { loader, textures, defaultTextureAssets } = this;
      if (defaultTextureAssets.length === 0) {
        return resolve();
      }
      defaultTextureAssets.forEach(textureAsset =>
        loader.add(textureAsset.name, textureAsset.url),
      );
      loader.load((_loader, resources) => {
        defaultTextureAssets.forEach(textureAsset => {
          const { name } = textureAsset;
          const resource = resources[name];
          if (resource.error) {
            reject(`Cannot load theme texture "${name}"`);
          } else {
            textures.set(name, resource.texture!);
            log(`Loaded theme texture "${name}"`);
          }
        });
        resolve();
      });
    });
  }

  protected initGraphics() {}

  texture(name: string) {
    return this.textures.get(name)!;
  }
}

// default theme
export class DefaultTheme extends Theme {
  get defaultTextureAssets(): TextureAsset[] {
    return [
      texture(ThemeElement.PanelBackground, './themes/default/panel.png'),
    ];
  }

  initGraphics() {
    const size = 42;
    const texture = new DynamicTexture(size, size);
    const sprite = new PIXI.Sprite(
      this.textures.get(ThemeElement.PanelBackground),
    );
    texture.fillRoundedRect(0, 0, size, size, 10, 0xff0000).paint();
    texture.drawObject(sprite);
    this.textures.set(ThemeElement.PanelBackground, texture.asTexture());
    log('theme init graphics');
  }
}
