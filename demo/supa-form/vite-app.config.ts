import vue from '@vitejs/plugin-vue';
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
        rollupOptions: {
            external: ['vue-i18n'],
            input: {
                main: 'index.html',
                preview: 'preview.html', // Specify the path for preview.html
            },
        },
    },

    define: {
        // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work
        // https://github.com/vitejs/vite/discussions/5912
        global: {},
    },
};

export default config;
