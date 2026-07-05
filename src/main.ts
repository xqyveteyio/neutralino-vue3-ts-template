import { createApp } from 'vue';
import { init } from '@neutralinojs/lib';
import App from './App.vue';
import { router } from './router';
import { setupNeutralino } from './neutralino';
import './style.css';

// 在纯浏览器里打开 Vite 页面调试时，Neutralino 全局变量不存在，跳过原生初始化
const inNeutralino = typeof window !== 'undefined' && 'NL_PORT' in window;

if (inNeutralino) {
  init();
  void setupNeutralino();
}

createApp(App).use(router).mount('#app');
