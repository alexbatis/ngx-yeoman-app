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
var electron = require('electron');
var dialog = electron.dialog;
// const { dialog } = require('electron').remote;
var BrowserWindow = electron.BrowserWindow;
var shell = electron.shell;
var path = require('path');
var url = require('url');
var events_1 = require("events");
var fork = require('child_process').fork;
var _ = require('underscore-plus');
var killChildProcess = require('./util/kill-childprocess');
var AppWindow = /** @class */ (function (_super) {
    __extends(AppWindow, _super);
    function AppWindow(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.loadSettings = {};
        _this.loadSettings = _.extend(_this.loadSettings, options);
        var windowOpts = {
            webPreferences: {
                subpixelFontScaling: true,
                directWrite: true
            }
        };
        windowOpts = _.extend(windowOpts, _this.loadSettings);
        _this.window = new BrowserWindow(options);
        _this.handleEvents();
        return _this;
    }
    AppWindow.prototype.show = function () {
        var targetPath = path.resolve(__dirname, '..', 'dist', 'index.html'); // build angular webapp
        var targetUrl = url.format({
            protocol: 'file',
            pathname: targetPath,
            slashes: true,
            query: {
                loadSettings: JSON.stringify(this.loadSettings)
            }
        });
        if (global.serve) {
            require('electron-reload')(__dirname, {
                electron: require("electron")
            });
            this.window.loadURL('http://localhost:4200');
            this.window.toggleDevTools(); // comment this out to start without devTools
        }
        else {
            this.window.loadURL(targetUrl);
        }
        this.window.webContents.on('did-finish-load', function () {
            this.initYoProcess();
        }.bind(this));
        this.window.show();
    };
    AppWindow.prototype.reload = function () {
        this.window.webContents.reload();
    };
    AppWindow.prototype.toggleFullScreen = function () {
        this.window.setFullScreen(!this.window.isFullScreen());
    };
    AppWindow.prototype.toggleDevTools = function () {
        this.window.toggleDevTools();
    };
    AppWindow.prototype.close = function () {
        this.window.close();
        this.window = null;
    };
    AppWindow.prototype.handleEvents = function () {
        this.window.on('closed', function (e) {
            this.emit('closed', e);
        }.bind(this));
        this.on('generator-cancel', this.killYoProcess);
        this.on('open-dialog', this.selectTargetDirectory);
        this.on('generator:done', this.openProject);
    };
    AppWindow.prototype.selectTargetDirectory = function () {
        var opts = {
            title: 'Select a folder to generate the project into',
            properties: ['openDirectory']
        };
        dialog.showOpenDialog(this.window, opts, function (filenames) {
            if (!filenames) {
                return;
            }
            this.sendCommandToBrowserWindow('generator:directory-selected', filenames.shift());
        }.bind(this));
    };
    AppWindow.prototype.openProject = function (cwd) {
        if (!cwd) {
            return;
        }
        var shown = shell.showItemInFolder(cwd);
    };
    AppWindow.prototype.initYoProcess = function () {
        if (this.loadSettings.isSpec) {
            return;
        }
        this.yoProcess = fork(path.join(__dirname, 'yo', 'yo.js'));
        this.yoProcess.on('message', function (msg) {
            console.log('APP', msg);
            this.sendCommandToBrowserWindow(msg.event, msg.data);
            this.emitCommandToAppWindow(msg.event, msg.data);
        }.bind(this));
        this.sendCommandToProcess('generator:init');
    };
    AppWindow.prototype.killYoProcess = function () {
        if (this.yoProcess && this.yoProcess.pid) {
            killChildProcess(this.yoProcess.pid, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    };
    AppWindow.prototype.emitCommandToAppWindow = function (event, data) {
        if (!event) {
            return;
        }
        this.emit(event, data);
    };
    AppWindow.prototype.sendCommandToBrowserWindow = function () {
        this.window.webContents.send.apply(this.window.webContents, arguments);
    };
    AppWindow.prototype.sendCommandToProcess = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.yoProcess.send({
            action: name,
            args: args
        });
    };
    return AppWindow;
}(events_1.EventEmitter));
exports.default = AppWindow;
// module.exports = AppWindow;
//# sourceMappingURL=appwindow.js.map