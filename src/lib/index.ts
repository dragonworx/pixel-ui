import { Panel } from './panel';
import { UI } from './ui';

UI.create(document.getElementById('main')!).then(ui => {
  console.log(ui);
  const panel = new Panel();
  ui.addChild(panel);
});
