<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 子窗口等独立页面不显示导航栏
const standalone = computed(() => route.meta.standalone === true);
</script>

<template>
  <div class="app">
    <nav v-if="!standalone" class="nav">
      <span class="brand">Neutralino + Vue3</span>
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
    </nav>
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.brand {
  font-weight: 700;
  margin-right: 0.5rem;
  color: var(--accent);
}

.nav a {
  color: var(--text-dim);
  text-decoration: none;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.nav a.router-link-active {
  color: var(--text);
  background: var(--surface-hover);
}

.page {
  flex: 1;
  padding: 1.5rem;
}
</style>
