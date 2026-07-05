<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { app, computer } from '@neutralinojs/lib';

const inNeutralino = 'NL_PORT' in window;
const memory = ref('');

onMounted(async () => {
  if (!inNeutralino) return;
  const info = await computer.getMemoryInfo();
  memory.value = `物理内存：${(info.physical.total / 1024 ** 3).toFixed(1)} GB，可用 ${(info.physical.available / 1024 ** 3).toFixed(1)} GB`;
});

function close() {
  void app.exit();
}
</script>

<template>
  <div class="child">
    <h1>子窗口</h1>
    <p>
      这是一个独立的 Neutralino 进程（入口 <code>child.html</code>），
      与主窗口不共享内存，但同样可以调用原生 API。
    </p>
    <p v-if="memory">{{ memory }}</p>
    <button class="secondary" :disabled="!inNeutralino" @click="close">关闭窗口</button>
  </div>
</template>

<style scoped>
.child {
  padding: 0.5rem;
}
</style>
