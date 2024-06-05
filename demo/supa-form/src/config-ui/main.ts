import '../global.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import Main from './Main.vue';

const app = createApp(Main);

app.use(ElementPlus);

app.mount('#app');
