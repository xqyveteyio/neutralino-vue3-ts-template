<script setup lang="ts">
const stack = [
  ['Neutralino', '6.8.0，轻量跨平台桌面运行时'],
  ['Vite', '7.x，开发服务器与打包'],
  ['Vue', '3.5+，组合式 API'],
  ['vue-router', '5.x，hash 模式路由'],
  ['TypeScript', '严格模式'],
];
</script>

<template>
  <div>
    <h1>关于</h1>
    <p>这个页面通过 <code>vue-router</code> 懒加载，演示路由切换与代码分割。</p>
    <div class="card">
      <ul>
        <li v-for="[name, desc] in stack" :key="name">
          <strong>{{ name }}</strong> — {{ desc }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
ul {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 2;
  color: var(--text-dim);
}

strong {
  color: var(--text);
}
</style>
