import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 端口必须与 neutralino.config.json 里 cli.frontendLibrary.devUrl 一致
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        // 多页面：主窗口 + 子窗口两个入口
        main: 'index.html',
        child: 'child.html',
      },
    },
  },
});
