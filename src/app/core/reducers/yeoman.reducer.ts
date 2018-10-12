/*--------------------IMPORTS-------------------------------------------*/
import { Action } from '@ngrx/store'; // NgRx
import { YeomanGenerator } from '@app/models/YeomanGenerator';
import { YeomanGeneratorQuestion } from '@app/models/YeomanGeneratorQuestion';

/*--------------------ACTION TYPES--------------------------------------*/
export enum YeomanActionTypes {
    INITIALIZE_STATE = '[Yeoman] Initialize State',
    GET_INSTALLED_GENERATORS = '[Yeoman] Get Installed Generators',
    SET_INSTALLED_GENERATORS = '[Yeoman] Set Installed Generators',
    SET_SELECTED_GENERATOR = '[Yeoman] Set Selected Generator',
    PROMPT_DIRECTORY_PATH = '[Yeoman] Prompt directory path',
    SET_SELECTED_DIRECTORY_PATH = '[Yeoman] Set selected directory path',
    RUN_SELECTED_GENERATOR = '[Yeoman] Run Selected Generator',
    SET_GENERATOR_PROMPT_QUESTIONS = '[Yeoman] Set Generator Prompt Questions',
    SUBMIT_GENERATOR_PROMPT_ANSWERS = '[Yeoman] Set Generator Prompt Answers',
}

/*--------------------ACTION TYPE CLASSES-------------------------------*/
export class InitializeYeomanStateAction implements Action {
    readonly type = YeomanActionTypes.INITIALIZE_STATE;
    constructor(public payload?: { initialState: YeomanState }) { }
}
export class GetInstalledGeneratorsAction implements Action {
    readonly type = YeomanActionTypes.GET_INSTALLED_GENERATORS;
}

export class SetInstalledGeneratorsAction implements Action {
    readonly type = YeomanActionTypes.SET_INSTALLED_GENERATORS;
    constructor(public payload: { installedGenerators: Array<YeomanGenerator> }) { }
}

export class SetSelectedGeneratorAction implements Action {
    readonly type = YeomanActionTypes.SET_SELECTED_GENERATOR;
    constructor(public payload: { selectedGenerator: YeomanGenerator }) { }
}

export class PromptDirectoryPathAction implements Action {
    readonly type = YeomanActionTypes.PROMPT_DIRECTORY_PATH;
}

export class SetSelectedDirectoryPathAction implements Action {
    readonly type = YeomanActionTypes.SET_SELECTED_DIRECTORY_PATH;
    constructor(public payload: { selectedDirectoryPath: string }) { }
}

export class RunSelectedGeneratorAction implements Action {
    readonly type = YeomanActionTypes.RUN_SELECTED_GENERATOR;
}

export class SetGeneratorPromptQuestionsAction implements Action {
    readonly type = YeomanActionTypes.SET_GENERATOR_PROMPT_QUESTIONS;
    constructor(public payload: { promptQuestions: Array<YeomanGeneratorQuestion> }) { }
}

export class SubmitGeneratorPromptAnswersAction implements Action {
    readonly type = YeomanActionTypes.SUBMIT_GENERATOR_PROMPT_ANSWERS;
    constructor(public payload: { answers: object }) { }
}


/*--------------------ACTION TYPE IMPLEMENTATION------------------------*/
export type YeomanActions =
    | InitializeYeomanStateAction
    | GetInstalledGeneratorsAction
    | SetInstalledGeneratorsAction
    | SetSelectedGeneratorAction
    | SetSelectedDirectoryPathAction
    | RunSelectedGeneratorAction
    | SetGeneratorPromptQuestionsAction
    | SubmitGeneratorPromptAnswersAction;

/*--------------------INITIAL STATE DEFINITION--------------------------*/
export interface YeomanState {
    installedGenerators: {
        loading: boolean,
        value: Array<YeomanGenerator>
    };
    selectedDirectoryPath: string;
    selectedGenerator: YeomanGenerator;
    promptQuestions: Array<YeomanGeneratorQuestion>;
    promptAnswers: object;
    generatorRunning: boolean;
}
export const initialState: YeomanState = {
    installedGenerators: {
        loading: true,
        value: []
    },
    selectedDirectoryPath: null,
    selectedGenerator: null,
    promptQuestions: null,
    promptAnswers: {},
    generatorRunning: false
};

/*--------------------REDUCER-------------------------------------------*/
export function yeomanReducer(
    state = initialState,
    action: YeomanActions
): YeomanState {
    switch (action.type) {
        case YeomanActionTypes.INITIALIZE_STATE:
            return action.payload ? action.payload.initialState : initialState;
        case YeomanActionTypes.SET_SELECTED_GENERATOR:
            return {
                ...state,
                selectedGenerator: action.payload.selectedGenerator
            };
        case YeomanActionTypes.SET_INSTALLED_GENERATORS:
            return {
                ...state,
                installedGenerators: {
                    loading: false,
                    value: action.payload.installedGenerators
                }
            };
        case YeomanActionTypes.SET_SELECTED_DIRECTORY_PATH:
            return {
                ...state,
                selectedDirectoryPath: action.payload.selectedDirectoryPath
            };
        case YeomanActionTypes.SET_GENERATOR_PROMPT_QUESTIONS:
            return {
                ...state,
                promptQuestions: action.payload.promptQuestions,
                generatorRunning: false
            };
        case YeomanActionTypes.SUBMIT_GENERATOR_PROMPT_ANSWERS:
            return {
                ...state,
                promptAnswers: action.payload.answers,
                generatorRunning: true
            };
        case YeomanActionTypes.RUN_SELECTED_GENERATOR:
            return {
                ...state,
                generatorRunning: true
            };
        default:
            return state;
    }
}
