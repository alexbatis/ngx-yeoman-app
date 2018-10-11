import { app, BrowserWindow, ipcMain, shell } from 'electron';
// import path from 'path';
const path = require('path');
import { EventEmitter } from 'events';
import _ from 'underscore-plus';
import AppWindow from './appwindow';
import AppMenu from './appmenu';

class Application extends EventEmitter {
  pkgJson: any;
  windows = [];
  menu: any;

  /**
   * The application's class.
   *
   * It's the entry point into the application and maintains the global state of the application.
   *
   * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
   * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
   */
  constructor(options = {}) {
    super();
    this.pkgJson = require('../package.json');
    this.windows = [];

    this.handleEvents();
    this.openWithOptions(options);
  }

  /**
   * Opens a new window based on the options provided.
   *
   * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
   * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
   */
  openWithOptions(options) {
    let newWindow;
    const { test } = options;

    if (test) {
      if (options.exitWhenDone === undefined) {
        options.exitWhenDone = true;
      }
      newWindow = this.openSpecsWindow(options);
    } else {
      newWindow = this.openWindow(options);
    }

    newWindow.show();
    this.windows.push(newWindow);
    newWindow.on('closed', () => {
      this.removeAppWindow(newWindow);
    });
  }

  /**
   * Opens up a new AtomWindow to run specs within.
   *
   * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
   */
  openSpecsWindow(options) {
    let bootstrapScript;
    const exitWhenDone = options.exitWhenDone;

    try {
      bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'helpers', 'bootstrap'));
    } catch (error) {
      bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'helpers', 'bootstrap'));
    }

    return new AppWindow({
      bootstrapScript: bootstrapScript,
      exitWhenDone: exitWhenDone,
      isSpec: true,
      title: `${this.pkgJson.productName}\'s Spec Suite`
    });
  }

  /**
   * Opens up a new AppWindow and runs the application.
   */
  openWindow(data: any) {
    const iconPath = path.resolve(__dirname, '..', 'src', 'assets', 'img', 'icon.png');
    console.log(iconPath);

    let appWindow;
    appWindow = new AppWindow({
      title: this.pkgJson.productName,
      icon: iconPath,
      width: 420,
      height: 742,
      titleBarStyle: 'hidden-inset'
    });

    this.menu = new AppMenu({
      pkg: this.pkgJson
    });
    this.menu.attachToWindow(appWindow);
    this.menu.on('application:quit', function () {
      app.quit();
      app.exit();
      console.log('bye');
      process.exit(0);
    });

    // this.menu.on('application:report-issue', () => {
    //   shell.openExternal(this.pkgJson.bugs);
    // });

    this.menu.on('window:reload', function () {
      BrowserWindow.getFocusedWindow().reload();
    });

    this.menu.on('window:toggle-full-screen', function () {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      let fullScreen = true;
      if (focusedWindow.isFullScreen()) {
        fullScreen = false;
      }

      focusedWindow.setFullScreen(fullScreen);
    });

    this.menu.on('window:toggle-dev-tools', function () {
      BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
    });

    this.menu.on('application:about', () => {
      shell.openExternal(this.pkgJson.homepage);
    });

    this.menu.on('application:run-specs', () => {
      return this.openWithOptions({
        test: true,
        exitWhenDone: false
      });
    });
    return appWindow;
  }

  /**
   * Removes the given window from the list of windows, so it can be GC'd.
   *
   * @param {AppWindow} appWindow The AppWindow to be removed
   */
  removeAppWindow(appWindow) {
    this.windows.forEach((win, index) => {
      if (win === appWindow) {
        this.windows.splice(index, 1);
      }
    });
  }

  handleEvents() {
    this.on('application:quit', function () {
      app.quit();
      app.exit();
      console.log('bye');
      process.exit(0);
    });

    // ipcMain.on('test',)

    ipcMain.on('context-appwindow', (event, ...args) => {
      const appWindow = this.windowForEvent(event.sender);
      appWindow.emit(...args);
    });

    ipcMain.on('context-generator', (event, ...args) => {
      const appWindow = this.windowForEvent(event.sender);
      appWindow.sendCommandToProcess(...args);
    });
  }

  // Returns the {AppWindow} for the given ipc event.
  windowForEvent(sender) {
    const win = BrowserWindow.fromWebContents(sender);
    const window = this.windows.find(w => w.window === win);
    return window;
    // return _.find(this.windows, function (appWindow) {
    //   return appWindow.window === win;
    // });
  }



}

export default function getApp(args) {
  return new Application(args);
}
