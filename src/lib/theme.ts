import { EventEmitter } from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { log } from './log';

export interface TextureAsset {
  name: string;
  url: string;
}

export const texture = (name: string, url: string): TextureAsset => ({
  name,
  url,
});

export enum ThemeDetail {
  Panel = 'panel',
}

export class Theme extends EventEmitter {
  loader: PIXI.Loader;
  textures: Map<string, PIXI.Texture<PIXI.Resource>> = new Map();

  constructor(baseUrl?: string) {
    super();
    this.loader = new PIXI.Loader(baseUrl);
  }

  get defaultTextureAssets(): TextureAsset[] {
    return [];
  }

  preload(): Promise<void> {
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

  texture(name: string) {
    return this.textures.get(name)!;
  }
}

export class DefaultTheme extends Theme {
  get defaultTextureAssets(): TextureAsset[] {
    return [texture(ThemeDetail.Panel, './themes/default/panel.png')];
  }
}
