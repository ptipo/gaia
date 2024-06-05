import { createContext } from '@lit/context';

export type answerData = {
    [key: string]: any;
};

export const formState = createContext<answerData>(Symbol('form-state'));
