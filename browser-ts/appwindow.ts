import { Global } from './../main';
const electron = require('electron');
const dialog = electron.dialog;
// const { dialog } = require('electron').remote;

const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const path = require('path');
const url = require('url');
import { EventEmitter } from 'events';
import { OpenDialogOptions } from 'electron';
const fork = require('child_process').fork;
const _ = require('underscore-plus');
const killChildProcess = require('./util/kill-childprocess');
declare var global: Global;

export default class AppWindow extends EventEmitter {
  loadSettings;
  window;
  yoProcess;

  constructor(options = {}) {
    super();
    this.loadSettings = {
      // bootstrapScript: require.resolve('../dist/assets/main')
    };
    this.loadSettings = _.extend(this.loadSettings, options);

    let windowOpts = {
      webPreferences: {
        subpixelFontScaling: true,
        directWrite: true
      }
    };
    windowOpts = _.extend(windowOpts, this.loadSettings);

    this.window = new BrowserWindow(options);
    this.handleEvents();
  }



  show() {
    const targetPath = path.resolve(__dirname, '..', 'dist', 'index.html'); // build angular webapp
    const targetUrl = url.format({
      protocol: 'file',
      pathname: targetPath,
      slashes: true,
      query: {
        loadSettings: JSON.stringify(this.loadSettings)
      }
    });

    if (global.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`electron`)
      });
      this.window.loadURL('http://localhost:4200');
      this.window.toggleDevTools(); // comment this out to start without devTools
    } else {
      this.window.loadURL(targetUrl);
    }



    this.window.webContents.on('did-finish-load', function () {
      this.initYoProcess();
    }.bind(this));

    this.window.show();
  }

  reload() {
    this.window.webContents.reload();
  }

  toggleFullScreen() {
    this.window.setFullScreen(!this.window.isFullScreen());
  }

  toggleDevTools() {
    this.window.toggleDevTools();
  }

  close() {
    this.window.close();
    this.window = null;
  }

  handleEvents() {

    this.window.on('closed', function (e) {
      this.emit('closed', e);
    }.bind(this));
    this.on('generator-cancel', this.killYoProcess);
    this.on('open-dialog', this.selectTargetDirectory);
    this.on('generator:done', this.openProject);
  }

  selectTargetDirectory() {
    const opts: OpenDialogOptions = {
      title: 'Select a folder to generate the project into',
      properties: ['openDirectory']
    };

    dialog.showOpenDialog(this.window, opts, function (filenames) {
      if (!filenames) {
        return;
      }

      this.sendCommandToBrowserWindow('generator:directory-selected', filenames.shift());
    }.bind(this));
  }

  openProject(cwd) {
    if (!cwd) {
      return;
    }

    const shown = shell.showItemInFolder(cwd);
  }

  initYoProcess() {
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
  }

  killYoProcess() {
    if (this.yoProcess && this.yoProcess.pid) {
      killChildProcess(this.yoProcess.pid, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  emitCommandToAppWindow(event, data) {
    if (!event) {
      return;
    }

    this.emit(event, data);
  }

  sendCommandToBrowserWindow() {
    this.window.webContents.send.apply(this.window.webContents, arguments);
  }

  sendCommandToProcess(name) {
    const args = Array.prototype.slice.call(arguments, 1);

    this.yoProcess.send({
      action: name,
      args: args
    });
  }
}
// module.exports = AppWindow;
