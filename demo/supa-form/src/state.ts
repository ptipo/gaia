import { createContext } from '@lit/context';

export type stateData = {
    [key: string]: any;
};

export const formState = createContext<stateData>(Symbol('form-state'));
