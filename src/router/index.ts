import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// 使用 hash 模式：主窗口与子窗口都从静态服务器加载，hash 路由无需服务端配合
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // 懒加载路由，演示代码分割
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/child',
      name: 'child',
      component: () => import('../views/ChildView.vue'),
      meta: { standalone: true },
    },
  ],
});
