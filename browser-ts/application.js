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
var electron_1 = require("electron");
// import path from 'path';
var path = require('path');
var events_1 = require("events");
var appwindow_1 = require("./appwindow");
var appmenu_1 = require("./appmenu");
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    /**
     * The application's class.
     *
     * It's the entry point into the application and maintains the global state of the application.
     *
     * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
     * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
     */
    function Application(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.windows = [];
        _this.pkgJson = require('../package.json');
        _this.windows = [];
        _this.handleEvents();
        _this.openWithOptions(options);
        return _this;
    }
    /**
     * Opens a new window based on the options provided.
     *
     * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
     * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
     */
    Application.prototype.openWithOptions = function (options) {
        var _this = this;
        var newWindow;
        var test = options.test;
        if (test) {
            if (options.exitWhenDone === undefined) {
                options.exitWhenDone = true;
            }
            newWindow = this.openSpecsWindow(options);
        }
        else {
            newWindow = this.openWindow(options);
        }
        newWindow.show();
        this.windows.push(newWindow);
        newWindow.on('closed', function () {
            _this.removeAppWindow(newWindow);
        });
    };
    /**
     * Opens up a new AtomWindow to run specs within.
     *
     * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
     */
    Application.prototype.openSpecsWindow = function (options) {
        var bootstrapScript;
        var exitWhenDone = options.exitWhenDone;
        try {
            bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'helpers', 'bootstrap'));
        }
        catch (error) {
            bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'helpers', 'bootstrap'));
        }
        return new appwindow_1.default({
            bootstrapScript: bootstrapScript,
            exitWhenDone: exitWhenDone,
            isSpec: true,
            title: this.pkgJson.productName + "'s Spec Suite"
        });
    };
    /**
     * Opens up a new AppWindow and runs the application.
     */
    Application.prototype.openWindow = function (data) {
        var _this = this;
        var iconPath = path.resolve(__dirname, '..', 'src', 'assets', 'img', 'icon.png');
        console.log(iconPath);
        var appWindow;
        appWindow = new appwindow_1.default({
            title: this.pkgJson.productName,
            icon: iconPath,
            width: 420,
            height: 742,
            titleBarStyle: 'hidden-inset'
        });
        this.menu = new appmenu_1.default({
            pkg: this.pkgJson
        });
        this.menu.attachToWindow(appWindow);
        this.menu.on('application:quit', function () {
            electron_1.app.quit();
            electron_1.app.exit();
            console.log('bye');
            process.exit(0);
        });
        // this.menu.on('application:report-issue', () => {
        //   shell.openExternal(this.pkgJson.bugs);
        // });
        this.menu.on('window:reload', function () {
            electron_1.BrowserWindow.getFocusedWindow().reload();
        });
        this.menu.on('window:toggle-full-screen', function () {
            var focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
            var fullScreen = true;
            if (focusedWindow.isFullScreen()) {
                fullScreen = false;
            }
            focusedWindow.setFullScreen(fullScreen);
        });
        this.menu.on('window:toggle-dev-tools', function () {
            electron_1.BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
        });
        this.menu.on('application:about', function () {
            electron_1.shell.openExternal(_this.pkgJson.homepage);
        });
        this.menu.on('application:run-specs', function () {
            return _this.openWithOptions({
                test: true,
                exitWhenDone: false
            });
        });
        return appWindow;
    };
    /**
     * Removes the given window from the list of windows, so it can be GC'd.
     *
     * @param {AppWindow} appWindow The AppWindow to be removed
     */
    Application.prototype.removeAppWindow = function (appWindow) {
        var _this = this;
        this.windows.forEach(function (win, index) {
            if (win === appWindow) {
                _this.windows.splice(index, 1);
            }
        });
    };
    Application.prototype.handleEvents = function () {
        var _this = this;
        this.on('application:quit', function () {
            electron_1.app.quit();
            electron_1.app.exit();
            console.log('bye');
            process.exit(0);
        });
        // ipcMain.on('test',)
        electron_1.ipcMain.on('context-appwindow', function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var appWindow = _this.windowForEvent(event.sender);
            appWindow.emit.apply(appWindow, args);
        });
        electron_1.ipcMain.on('context-generator', function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var appWindow = _this.windowForEvent(event.sender);
            appWindow.sendCommandToProcess.apply(appWindow, args);
        });
    };
    // Returns the {AppWindow} for the given ipc event.
    Application.prototype.windowForEvent = function (sender) {
        var win = electron_1.BrowserWindow.fromWebContents(sender);
        var window = this.windows.find(function (w) { return w.window === win; });
        return window;
        // return _.find(this.windows, function (appWindow) {
        //   return appWindow.window === win;
        // });
    };
    return Application;
}(events_1.EventEmitter));
function getApp(args) {
    return new Application(args);
}
exports.default = getApp;
//# sourceMappingURL=application.js.map