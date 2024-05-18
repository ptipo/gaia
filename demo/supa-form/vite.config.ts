import { resolve } from 'path';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'SupaForm',
            fileName: 'index',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
};

export default config;
