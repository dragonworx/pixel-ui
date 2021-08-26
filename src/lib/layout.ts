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
}

export class FillLayout extends Layout {
  apply(children: Node[], availableWidth: number, availableHeight: number) {
    children.forEach(child =>
      child.setBounds(0, 0, availableWidth, availableHeight),
    );
  }
}
