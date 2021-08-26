import EventEmitter from 'eventemitter3';
import * as PIXI from 'pixi.js';
import { Layout, FillLayout } from './layout';
import { log } from './log';
import { Theme, ThemeElement, DefaultTheme } from './theme';

let counter = 0;

export abstract class Node extends EventEmitter {
  protected layout: Layout;
  protected container: PIXI.Container;
  protected _width: number = 0;
  protected _height: number = 0;
  protected elements: Map<ThemeElement, PIXI.Container>;

  id: number = counter++;
  parent?: Node;
  children: Node[] = [];
  theme: Theme;

  constructor(theme?: Theme) {
    super();
    this.theme = theme || new DefaultTheme();
    this.layout = this.defaultLayout;
    this.container = new PIXI.Container();
    this.elements = new Map();
  }

  get defaultLayout(): Layout {
    return new FillLayout();
  }

  get x() {
    return this.container.x;
  }

  get y() {
    return this.container.y;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setBounds(x: number, y: number, width: number, height: number) {
    const { container } = this;
    if (x !== container.x && y !== container.y) {
      this.container.x = x;
      this.container.y = y;
    }
    this.onResize(width, height);
  }

  onResize(width: number, height: number) {
    if (width !== this._width || height !== this._height) {
      this._width = width;
      this._height = height;
      this.applyLayout();
    }
  }

  applyLayout() {
    this.layout.apply(this.children, this._width, this._height);
  }

  addChild(child: Node) {
    const { theme } = this;
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (child.theme !== theme) {
      child.theme = theme;
      child.container.removeChildren();
      child.createAppreanceFromTheme();
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

  abstract createAppreanceFromTheme(): void;

  onUpdate = () => {};

  element<T extends PIXI.Container>(name: ThemeElement): T {
    return this.elements.get(name)! as T;
  }

  addElement(name: ThemeElement, element: PIXI.Container) {
    this.elements.set(name, element);
    this.container.addChild(element);
    return element;
  }

  sizeElement(name: ThemeElement, width: number, height: number) {
    const element = this.element(name);
    element.width = width;
    element.height = height;
    return element;
  }
}
