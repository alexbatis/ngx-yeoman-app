"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Menu = require('electron').Menu;
var path = require('path');
var season = require('season');
var events_1 = require("events");
var _ = require('underscore-plus');
var ApplicationMenu = /** @class */ (function (_super) {
    __extends(ApplicationMenu, _super);
    function ApplicationMenu(options) {
        var _this = _super.call(this) || this;
        // _.extend(ApplicationMenu.prototype, EventEmitter.prototype);
        _this.attachToWindow = function () {
            this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
            Menu.setApplicationMenu(this.menu);
        };
        _this.wireUpMenu = function (menu, command) {
            menu.click = function () {
                this.emit(command);
            }.bind(this);
        };
        _this.translateTemplate = function (template, pkgJson) {
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
        _this.acceleratorForCommand = function (command, keystrokesByCommand) {
            var firstKeystroke = keystrokesByCommand[command];
            firstKeystroke = firstKeystroke && firstKeystroke.length ? firstKeystroke[0] : null;
            if (!firstKeystroke) {
                return null;
            }
            var modifiers = firstKeystroke.split('-');
            var key = modifiers.pop();
            modifiers = modifiers.map(function (modifier) {
                return modifier.replace(/shift/ig, 'Shift').replace(/cmd/ig, 'Command2').replace(/ctrl/ig, 'Ctrl').replace(/alt/ig, 'Alt');
            });
            var keys = modifiers.concat([key.toUpperCase()]);
            return keys.join('+');
        };
        var menuJson = season.resolve(path.join(__dirname, '..', 'menus', process.platform + '.json'));
        var template = season.readFileSync(menuJson);
        _this.template = _this.translateTemplate(template.menu, options.pkg);
        return _this;
    }
    return ApplicationMenu;
}(events_1.EventEmitter));
exports.default = ApplicationMenu;
//# sourceMappingURL=appmenu.js.map