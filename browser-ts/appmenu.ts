const Menu = require('electron').Menu;
const path = require('path');
const season = require('season');
import { EventEmitter } from 'events';
const _ = require('underscore-plus');

export default class ApplicationMenu extends EventEmitter {
  template;
  constructor(options) {
    super();
    const menuJson = season.resolve(path.join(__dirname, '..', 'menus', process.platform + '.json'));
    const template = season.readFileSync(menuJson);
    this.template = this.translateTemplate(template.menu, options.pkg);
  }


  // _.extend(ApplicationMenu.prototype, EventEmitter.prototype);

  attachToWindow = function () {
    this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
    Menu.setApplicationMenu(this.menu);
  };

  wireUpMenu = function (menu, command) {
    menu.click = function () {
      this.emit(command);
    }.bind(this);
  };

  translateTemplate = function (template, pkgJson) {
    template.forEach(function (item) {
      if (!item.metadata) {
        item.metadata = {};
      }
      if (item.label) {
        item.label = _.template(item.label)(pkgJson);
      }
      if (item.command) {
        this.wireUpMenu(item, item.command);
      }
      if (item.submenu) {
        this.translateTemplate(item.submenu, pkgJson);
      }
    }.bind(this));

    return template;
  };

  acceleratorForCommand = function (command, keystrokesByCommand) {
    let firstKeystroke = keystrokesByCommand[command];
    firstKeystroke = firstKeystroke && firstKeystroke.length ? firstKeystroke[0] : null;
    if (!firstKeystroke) {
      return null;
    }

    let modifiers = firstKeystroke.split('-');
    const key = modifiers.pop();
    modifiers = modifiers.map(function (modifier) {
      return modifier.replace(/shift/ig, 'Shift').replace(/cmd/ig, 'Command2').replace(/ctrl/ig, 'Ctrl').replace(/alt/ig, 'Alt');
    });

    const keys = modifiers.concat([key.toUpperCase()]);
    return keys.join('+');
  };

}
