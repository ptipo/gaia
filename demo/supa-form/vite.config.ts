import type { UserConfig } from 'vite';
import { resolve } from 'path';

const config: UserConfig = {
    build: {
        lib: {
            entry: resolve(__dirname, './src/component/pt-form.ts'),
            name: 'PtForm',
            fileName: 'index',
        },
    },
};

export default config;
