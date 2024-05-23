import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/es/components/message/style/css';
import { createApp } from 'vue';
import Main from './Main.vue';
import './style.css';

const app = createApp(Main);

// TODO: on-demand import of Element-Plus
app.use(ElementPlus);

app.mount('#app');
