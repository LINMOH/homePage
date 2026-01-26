<template>
  <header class="time-bar">
    <div class="time-display">{{ currentTime }}</div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 时间显示
const currentTime = ref('');
let timer = null;

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* 顶部时间状态栏：极简主义风格 */
.time-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.time-display {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-main);
  font-variant-numeric: tabular-nums;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .time-display {
    font-size: 10px;
  }
}
</style>
