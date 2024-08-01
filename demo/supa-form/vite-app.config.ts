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
            input: {
                main: 'index.html',
                preview: 'preview.html', // Specify the path for preview.html
            },
        },
    },
};

export default config;
