import {createApp} from 'vue';
import App from './App.vue';
import {key, store} from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import '@renderer/theme/index.scss'
import other from "@renderer/utils/other";
import mitt from 'mitt';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import {errorHandler} from "@renderer/error";

const app = createApp(App);
other.elSvg(app);

app.use(router).use(store, key).use(ElementPlus, {locale}).mount('#app');
app.config.globalProperties.mittBus = mitt();

errorHandler(app)