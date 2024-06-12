// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    modules: ['@element-plus/nuxt', '@hebilicious/vue-query-nuxt'],

    elementPlus: {},

    vite: {
        optimizeDeps: {
            include: ['dayjs', 'dayjs/plugin/*'],
        },
    },

    build: {
        // https://github.com/nuxt/nuxt/issues/19265
        transpile: ['tslib'],
    },
});
