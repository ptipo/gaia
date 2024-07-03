import { createContext } from '@lit/context';
import { QuestionState } from './component/pt-base';

type answerData = {
    [key: string]: QuestionState<any>;
};

export class FormAnswerData {
    answers: answerData = {};
    currentPageId?: string;
}

export const formState = createContext<FormAnswerData>(Symbol('form-state'));

export const formWidth = createContext<number>(Symbol('form-width'));
