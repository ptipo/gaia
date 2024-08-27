import '../global.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import Main from './Main.vue';
import { createI18n, useI18n } from 'vue-i18n';

const app = createApp(Main);

app.use(ElementPlus);
app.use(createI18n({ legacy: false, locale: 'zh' }));

app.mount('#app');
