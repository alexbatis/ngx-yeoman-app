import { ElectronService } from './../../providers/electron.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import {
    YeomanActionTypes,
    RunSelectedGeneratorAction,
    YeomanState,
    SubmitGeneratorPromptAnswersAction,
    InitializeYeomanStateAction,
    PromptDirectoryPathAction
} from '@app/core/reducers/yeoman.reducer';

@Injectable()
export class YeomanEffects {
    constructor(
        private store: Store<any>,
        private actions$: Actions<Action>,
        private electronService: ElectronService
    ) { }

    @Effect({ dispatch: false })
    promptDirectoryPath$: Observable<Action> = this.actions$.pipe(
        ofType(YeomanActionTypes.PROMPT_DIRECTORY_PATH),
        tap((action: PromptDirectoryPathAction) => {
            this.electronService.promptDirectoryPath();
        })
    );

    @Effect({ dispatch: false })
    runGenerator$: Observable<Action> = this.actions$.pipe(
        ofType(YeomanActionTypes.RUN_SELECTED_GENERATOR),
        tap((action: RunSelectedGeneratorAction) => {
            this.store.pipe(take(1), select(s => s.yeoman))
                .subscribe((state: YeomanState) => {
                    if (state.selectedGenerator && state.selectedDirectoryPath)
                        this.electronService.runSelectedGenerator(state.selectedGenerator.name, state.selectedDirectoryPath);
                    else
                        console.error('Cannot run generator because both a generator and a directory to run it in have not been selected');
                });
        })
    );

    @Effect({ dispatch: false })
    submitAnswers$: Observable<Action> = this.actions$.pipe(
        ofType(YeomanActionTypes.SUBMIT_GENERATOR_PROMPT_ANSWERS),
        tap((action: SubmitGeneratorPromptAnswersAction) => {
            this.store.pipe(take(1), select(s => s.yeoman))
                .subscribe((state: YeomanState) => {
                    this.electronService.submitAnswers(action.payload.answers);
                });
        })
    );

    @Effect({ dispatch: false })
    initializeState$: Observable<Action> = this.actions$.pipe(
        ofType(YeomanActionTypes.INITIALIZE_STATE),
        tap((action: InitializeYeomanStateAction) => {
            this.store.pipe(take(1), select(s => s.yeoman))
                .subscribe((state: YeomanState) => {
                    this.electronService.initializeYeomanState();
                });
        })
    );
}
