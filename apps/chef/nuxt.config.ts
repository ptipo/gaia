// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],

    compatibilityDate: '2024-07-03',

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    plugins: [{ src: '~/plugins/element-plus', mode: 'client' }],

    modules: ['@element-plus/nuxt', '@hebilicious/vue-query-nuxt', '@nuxtjs/i18n'],

    elementPlus: {
        icon: 'ElIcon',
    },

    vite: {
        optimizeDeps: {
            include: ['dayjs', 'dayjs/plugin/*'],
        },
        define: {
            // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work
            // https://github.com/vitejs/vite/discussions/5912
            global: {},
        },
    },

    imports: {
        transform: {
            // prevent nuxt from analyzing supa-form bundle code
            exclude: [/.*supa\-form.*/],
        },
    },

    nitro: {
        esbuild: {
            options: {
                // https://github.com/nuxt/nuxt/issues/14348
                target: 'esnext',
            },
        },
        vercel: {
            functions: {
                maxDuration: 300,
            },
        },
    },

    runtimeConfig: {
        publishBucket: '',
        public: {
            publishAccessPoint: '',
            aiGeneratingModelExpectedTime: 25000,
            aiGeneratingElaborateExpectedTime: 5000,
        },
    },

    hooks: {
        'vite:extendConfig'(viteInlineConfig, env) {
            viteInlineConfig.server = {
                ...viteInlineConfig.server,
                hmr: {
                    protocol: 'ws',
                    host: 'localhost',
                },
            };
        },
    },

    i18n: {
        strategy: 'no_prefix',
        locales: [
            {
                code: 'en',
                name: 'English',
            },
            {
                code: 'zh',
                name: '中文',
            },
            {
                code: 'ja',
                name: '日本語',
            },
        ],
    },
});
