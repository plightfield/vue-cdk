import { createApp } from 'vue'
import App from './App.vue';
import {overlay} from './components/overlay';
import './index.css';

createApp(App).use(overlay).mount('#app')
