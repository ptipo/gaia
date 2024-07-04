import { createAppInstance } from '@hayadev/configurator';
import { version as appVersion } from '../package.json';
import { FormApp } from './config';

export const app = createAppInstance(FormApp, appVersion);
