import EventEmitter from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { Layout, FillLayout } from './layout';
import { log } from './log';
import { Theme, DefaultTheme } from './theme';

let counter = 0;

export abstract class Node extends EventEmitter {
  id: number = counter++;
  parent?: Node;
  children: Node[] = [];
  theme: Theme;
  layout: Layout;
  container: PIXI.Container;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  constructor(theme?: Theme) {
    super();
    this.theme = theme || new DefaultTheme();
    this.layout = this.defaultLayout;
    this.container = new PIXI.Container();
  }

  get defaultLayout(): Layout {
    return new FillLayout();
  }

  onResize(width: number, height: number) {
    // log(`Resize #${this.id} node ${width}x${height}`);
    this.width = width;
    this.height = height;
    this.applyLayout();
  }

  applyLayout() {
    this.layout.apply(this.children, this.width, this.height);
  }

  addChild(child: Node) {
    const { theme } = this;
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (child.theme !== theme) {
      child.theme = theme;
      child.container.removeChildren();
      child.createAppreance();
    }
    this.children.push(child);
    this.container.addChild(child.container);
    this.applyLayout();
  }

  removeChild(child: Node) {
    const { children } = this;
    const index = children.findIndex(node => node === child);
    children.splice(index, 1);
    this.container.removeChild(child.container);
  }

  abstract createAppreance(): void;

  onUpdate = () => {};
}
