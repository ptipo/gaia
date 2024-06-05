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
        {
            name: 'use-configurator-html',
            transformIndexHtml: {
                order: 'pre',
                handler() {
                    return fs.readFileSync('./configurator.html', 'utf-8');
                },
            },
        },
    ],

    build: {
        outDir: 'app-dist',
    },
};

export default config;
