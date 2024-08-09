import { createAppInstance, inferConcept } from '@hayadev/configurator';
import { version as appVersion } from '../package.json';
import { FormApp } from './config';

export const app = createAppInstance(FormApp, appVersion);
export type FormModel = inferConcept<(typeof FormApp)['concept']>;
