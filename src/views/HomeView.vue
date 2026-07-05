<script setup lang="ts">
import { ref } from 'vue';
import { openChildWindow } from '../neutralino';

const inNeutralino = 'NL_PORT' in window;
const count = ref(0);

const info = inNeutralino
  ? `Neutralino v${NL_VERSION} · ${NL_OS} · 端口 ${NL_PORT}`
  : '当前在纯浏览器中运行，原生 API 不可用';
</script>

<template>
  <div>
    <h1>首页</h1>
    <p>{{ info }}</p>

    <div class="card">
      <h2>HMR 测试</h2>
      <p>修改这个组件保存后，计数状态会保留：</p>
      <button @click="count++">点击了 {{ count }} 次</button>
    </div>

    <div class="card">
      <h2>子窗口</h2>
      <p>
        点击下面的按钮，或者点击系统托盘菜单里的「打开子窗口」，
        会创建一个独立进程的原生子窗口。
      </p>
      <button :disabled="!inNeutralino" @click="openChildWindow()">打开子窗口</button>
    </div>

    <div class="card">
      <h2>托盘</h2>
      <p>
        点击主窗口的关闭按钮不会退出应用，而是隐藏到系统托盘；
        通过托盘菜单「显示主窗口」恢复，「退出」才会结束进程。
      </p>
    </div>
  </div>
</template>
