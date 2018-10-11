import { YeomanGenerator } from '@app/models/YeomanGenerator';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  YeomanState,
  SetSelectedDirectoryPathAction,
  SetSelectedGeneratorAction,
  RunSelectedGeneratorAction,
  SubmitGeneratorPromptAnswersAction
} from '@app/core/reducers/yeoman.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  yeomanState$: Observable<YeomanState>;
  answers: object;

  constructor(private store: Store<any>) {
    this.yeomanState$ = store.pipe(select(s => s.yeoman));
    this.answers = {};
  }

  ngOnInit() {
    this.yeomanState$.subscribe((state: YeomanState) => {
      if (state.promptQuestions)
        state.promptQuestions.forEach(question => {

          // There's a new question, give it an answer
          if (this.answers[question.name] === undefined) {
            // handle choices first
            if (question.choices && question.choices.length) {
              // this.answers[question.name]['choices'] = question.choices;
              this.answers[question.name] = {};
              this.answers[question.name]['choices'] = [];
              const myChoices = [];
              question.choices.forEach(choice => {
                myChoices.push({
                  name: choice.name,
                  selected: choice.selected
                });
              });
              this.answers[question.name]['choices'] = myChoices;
            } else
              this.answers[question.name] = question.default || null;               // basic field with no choics
          }

        });
    });
  }

  selectGenerator(generator: YeomanGenerator) {
    this.store.dispatch(new SetSelectedGeneratorAction({ selectedGenerator: generator }));
  }

  openDirectoryChooser() {
    document.getElementById('directory-chooser').click();
  }

  setSelectedDirectoryPath() {
    const selectedDirectoryPath = (document.getElementById('directory-chooser')['files'][0].path) || null;
    this.store.dispatch(new SetSelectedDirectoryPathAction({ selectedDirectoryPath: selectedDirectoryPath }));
  }

  runGenerator() {
    this.store.dispatch(new RunSelectedGeneratorAction());
  }

  submitAnswers() {
    this.store.dispatch(new SubmitGeneratorPromptAnswersAction({ answers: this.answers }));
  }


  init() {
    console.log('sending generator:init');
    require('electron').ipcRenderer.send('context-generator', 'generator:init');
  }

  selectDirectory() {
    console.log('sending generator:directory-selected');
    require('electron').ipcRenderer.send('context-generator', 'generator:directory-selected',
      'C:\\Users\\Alex\\Desktop');
  }

  runGeneratorOld() {
    console.log('sending generator:run');
    require('electron').ipcRenderer.send('context-generator', 'generator:run', 'node-ts-express',
      'C:\\Users\\Alex\\Desktop');


    // // // // C:\\Users\\Alex\\Downloads\\test-app.json
    // require('electron').ipcRenderer.send('context-generator', 'generator:prompt-answer', {});
  }

  promptQuestions() {
    console.log('sending generator:prompt-questions');
    require('electron').ipcRenderer.send('context-generator', 'generator:prompt-questions');
  }

  promptAnswer() {
    console.log('sending generator:prompt-answer');
    require('electron').ipcRenderer.send('context-generator', 'generator:prompt-answer', {
      configurationFileDirectory: 'configuration.json',
      outputDirectory: 'C:\\Users\\Alex\\Desktop'
    });
  }

}
