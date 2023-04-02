import 'uno.css'
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import "./styles/base.scss";
import { registerActualWindowSizeCss } from './utils/screen';
import { createPinia } from 'pinia';

registerActualWindowSizeCss()
const app = createApp(App);

app.use(createPinia())
app.use(router);
app.mount('#app');