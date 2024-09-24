import { createAppInstance, inferConcept } from '@hayadev/configurator';
import { version as appVersion } from '../package.json';
import { config } from './config';

export const app = createAppInstance(config, appVersion);
export type FormModel = inferConcept<(typeof config)['concept']>;
