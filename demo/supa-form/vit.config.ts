import type { UserConfig } from 'vite';
import { resolve } from 'path';

const config: UserConfig = {
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
};

export default config;
