import { Element } from './element';
import { UI } from './ui';

UI.create(document.getElementById('main')!).then(ui => {
  console.log(ui);
  const element = new Element();
  ui.addChild(element);
});
