<template>
  <section id="comments" class="section">
    <div class="section-header">
      <h2 class="section-title">{{ content.comments?.title || 'Comments' }}</h2>
    </div>
    <div class="about-content">
      <div ref="giscusContainer"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { currentLanguage } from '../locales';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';

const content = computed(() => {
  const lang = currentLanguage.value;
  if (lang === 'zh') return zhCN;
  if (lang === 'jp') return jaJP;
  return enUS;
});

const giscusContainer = ref(null);
let themeObserver = null;

// 获取当前主题
const getCurrentTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

// 语言映射
const giscusLang = computed(() => {
  return {
    zh: 'zh-CN',
    jp: 'ja',
    en: 'en'
  }[currentLanguage.value] || 'en';
});

const loadGiscus = () => {
  if (!giscusContainer.value) return;

  giscusContainer.value.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  const attrs = {
    'data-repo': 'LINMOH/discussions',
    'data-repo-id': 'R_kgDOOvKQHA',
    'data-category': 'Announcements',
    'data-category-id': 'DIC_kwDOOvKQHM4Cqfyc',
    'data-mapping': 'url',
    'data-reactions-enabled': '1',
    'data-input-position': 'top',
    'data-theme': getCurrentTheme() === 'dark' ? 'dark' : 'light',
    'data-lang': giscusLang.value
  };

  Object.entries(attrs).forEach(([k, v]) => {
    script.setAttribute(k, v);
  });

  giscusContainer.value.appendChild(script);
};

onMounted(() => {
  loadGiscus();
  
  // 使用 MutationObserver 监听主题变化
  themeObserver = new MutationObserver(() => {
    loadGiscus();
  });
  
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});

// 监听语言变化，重新加载 Giscus
watch(currentLanguage, () => {
  loadGiscus();
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
});
</script>

<style>
/* 区块样式 */
.section {
  border-bottom: 1px solid var(--border-color);
}

.section-header {
  padding: 40px var(--pad-lg);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--text-main);
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--bg);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 评论部分样式 - 与其他 section 保持一致 */
.about-content {
  padding: var(--pad-lg);
}
</style>
