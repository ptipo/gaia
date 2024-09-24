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
        vue(),
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
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AppConfigurator',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['vue', 'element-plus', 'vue-i18n'],
            output: {
                globals: {
                    vue: 'Vue',
                    'element-plus': 'ElementPlus',
                },
            },
        },
        commonjsOptions: {
            esmExternals: ['vue', 'element-plus', 'vue-i18n'],
        },
        sourcemap: true,
    },

    define: {
        // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work
        // https://github.com/vitejs/vite/discussions/5912
        global: {},
    },
});
