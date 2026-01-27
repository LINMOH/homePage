<template>
  <footer class="footer">
    <span>{{ content.footer.location }}</span>
    <span class="copyright accent-text">© {{ content.footer.copyrightStartYear }}–{{ currentYear }} Lin Mohan</span>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { currentLanguage } from '../locales';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';

// 根据当前语言获取内容
const content = computed(() => {
  const lang = currentLanguage.value;
  if (lang === 'zh') return zhCN;
  if (lang === 'jp') return jaJP;
  return enUS;
});

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  padding: var(--pad-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.accent-text {
  color: var(--accent);
  font-weight: 700;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.copyright {
  color: var(--text-sub);
  font-weight: 400;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}
</style>
