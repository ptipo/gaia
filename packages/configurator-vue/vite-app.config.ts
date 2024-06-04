import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ['pt-form'].includes(tag),
                },
            },
        }),
        AutoImport({
            resolvers: [
                // ElementPlusResolver(),
                IconsResolver(),
            ],
        }),
        Components({
            resolvers: [
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                // ElementPlusResolver(),
            ],
        }),
        Icons({
            autoInstall: true,
        }),
    ],

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, './src/components'),
            '@assets': resolve(__dirname, './src/assets'),
        },
    },

    build: {
        outDir: 'app-dist',
        rollupOptions: {
            external: ['../pt-form.js'],
        },
    },
});
