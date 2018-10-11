import { YeomanGeneratorQuestion } from './../models/YeomanGeneratorQuestion';
import {
  SetInstalledGeneratorsAction,
  SetGeneratorPromptQuestionsAction,
  InitializeYeomanStateAction
} from './../core/reducers/yeoman.reducer';
import { CommonService } from './common/common.service';
import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Store } from '@ngrx/store';
import { GetInstalledGeneratorsAction } from '@app/core/reducers/yeoman.reducer';
import { YeomanGenerator } from '@app/models/YeomanGenerator';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  BrowserEvents = {
    'generator:installed-generators': 'generatorsDataReceived',
    'generator:prompt-questions': 'questionPrompt',
    'generator:install': 'generatorInstall',
    'generator:done': 'generatorDone',
    'generator:directory-selected': 'folderSelected'
  };



  constructor(private store: Store<any>, private commonService: CommonService) {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');


      Object.keys(this.BrowserEvents).forEach((event) => {
        this.ipcRenderer.on(event, (e, data) => {
          if (event === 'generator:installed-generators')
            this.setInstalledGenerators(data);
          else if (event === 'generator:prompt-questions')
            this.promptQuestions(data);
          else if (event === 'generator:done')
            this.completeGenerator(data);

          // console.log(event, data);
        });
      });
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  initializeYeomanState() {
    this.ipcRenderer.send('context-generator', 'generator:init');
  }

  setInstalledGenerators(data: any) {
    const generators = this.commonService.deserializeArray<YeomanGenerator>(data, YeomanGenerator);
    this.store.dispatch(new SetInstalledGeneratorsAction({ installedGenerators: generators }));
  }

  runSelectedGenerator(selectedGeneratorName: string, selectedDirectoryPath: string) {
    this.ipcRenderer.send('context-generator', 'generator:run', selectedGeneratorName, selectedDirectoryPath);
  }

  promptQuestions(data: any) {
    const questions = this.commonService.deserializeArray<YeomanGeneratorQuestion>(data, YeomanGeneratorQuestion);
    this.store.dispatch(new SetGeneratorPromptQuestionsAction({ promptQuestions: questions }));
  }

  submitAnswers(answers: object) {
    this.ipcRenderer.send('context-generator', 'generator:prompt-answer', answers);
  }

  completeGenerator(data: any) {
    this.store.dispatch(new InitializeYeomanStateAction());
    alert(`Generator has completed. Your project has been generated at ${data}.`);
  }


}
