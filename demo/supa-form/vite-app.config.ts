import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ['pt-form'].includes(tag),
                },
            },
        }),
    ],

    build: {
        outDir: 'app-dist',
    },
};

export default config;
