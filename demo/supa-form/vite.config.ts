import type { UserConfig } from 'vite';
import { resolve } from 'path';

const config: UserConfig = {
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'PtForm',
            fileName: 'index',
        },
    },
    test: {
        browser: {
            enabled: true,
            name: 'chrome',
            provider: 'webdriverio',
        },
    },
};

export default config;
