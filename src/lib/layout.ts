import { EventEmitter } from 'eventemitter3';
import { log } from './log';
import { Node } from './node';

export abstract class Layout extends EventEmitter {
  constructor() {
    super();
  }

  abstract apply(
    children: Node[],
    availableWidth: number,
    availableHeight: number,
  ): void;

  positionChild(
    child: Node,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    // log(`Position child ${x}x${y}@${width}x${height}`);
    child.x = x;
    child.y = y;
    child.width = width;
    child.height = height;
    child.container.x = x;
    child.container.y = y;
    child.onResize(width, height);
  }
}

export class FillLayout extends Layout {
  apply(children: Node[], availableWidth: number, availableHeight: number) {
    children.forEach(child =>
      this.positionChild(child, 0, 0, availableWidth, availableHeight),
    );
  }
}
