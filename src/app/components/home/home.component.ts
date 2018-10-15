import { YeomanGenerator } from '@app/models/YeomanGenerator';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  YeomanState,
  SetSelectedDirectoryPathAction,
  SetSelectedGeneratorAction,
  RunSelectedGeneratorAction,
  SubmitGeneratorPromptAnswersAction,
  PromptDirectoryPathAction
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
    this.store.dispatch(new PromptDirectoryPathAction());
  }

  runGenerator() {
    this.store.dispatch(new RunSelectedGeneratorAction());
  }

  submitAnswers() {
    this.store.dispatch(new SubmitGeneratorPromptAnswersAction({ answers: this.answers }));
  }

}