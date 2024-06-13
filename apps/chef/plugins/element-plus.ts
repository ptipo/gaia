import ElementPlus from 'element-plus';

// Nuxt's element-plus module doesn't register element-plus components on the Vue app.
// We need to do this otherwise configurator-vue won't work.
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ElementPlus);
});
