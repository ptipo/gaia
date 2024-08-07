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

    modules: ['@element-plus/nuxt', '@hebilicious/vue-query-nuxt'],

    elementPlus: {
        icon: 'ElIcon',
    },

    vite: {
        optimizeDeps: {
            include: ['dayjs', 'dayjs/plugin/*'],
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
});
