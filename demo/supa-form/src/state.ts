import { createContext } from '@lit/context';
import { QuestionState } from './component/pt-base';

export type answerData = {
    [key: string]: QuestionState<any>;
};

export const formState = createContext<answerData>(Symbol('form-state'));

export const formWidth = createContext<number>(Symbol('form-width'));
