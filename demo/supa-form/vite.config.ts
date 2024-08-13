import type { UserConfig } from 'vite';
import { resolve } from 'path';

const config: UserConfig = {
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'PtForm',
            fileName: 'index',
        },
        emptyOutDir: false,
    },
    test: {
        browser: {
            enabled: true,
            name: 'chrome',
            provider: 'webdriverio',
        },
    },
    define: {
        // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work
        // https://github.com/vitejs/vite/discussions/5912
        global: {},
    },
};

export default config;
