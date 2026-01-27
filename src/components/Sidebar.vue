<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <div class="avatar-section">
        <img :src="getPublicPath(content.site.logo)" :alt="content.site.name" class="avatar" />
        <h1 class="user-name">{{ content.sidebar.userName }}</h1>
        <p class="user-handle">{{ content.sidebar.userHandle }}</p>
      </div>

      <div class="sidebar-footer">
        <p class="location">{{ content.sidebar.location }}</p>
        <p class="bio">{{ content.sidebar.bio }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { currentLanguage, getPublicPath } from '../locales';
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
</script>

<style scoped>
/* 侧栏：极简主义风格 */
.sidebar {
  width: 320px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 40px;
  height: calc(100vh - 40px);
  flex-shrink: 0;
}

.sidebar-content {
  padding: var(--pad-lg);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.avatar-section {
  margin-bottom: var(--pad-lg);
  padding-bottom: var(--pad-md);
}

.avatar {
  width: 80px;
  height: 80px;
  border: 1px solid var(--border-color);
  margin-bottom: var(--pad-sm);
}

.user-name {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 4px;
  letter-spacing: -1px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.user-handle {
  font-size: 12px;
  color: var(--text-sub);
  letter-spacing: 1px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.sidebar-footer {
  margin-top: auto;
}

.location {
  font-size: 10px;
  color: var(--text-sub);
  letter-spacing: 1px;
  margin-bottom: 4px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.bio {
  font-size: 10px;
  color: var(--text-sub);
  letter-spacing: 0.5px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-content {
    padding: var(--pad-md);
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .user-name {
    font-size: 20px;
  }
}
</style>
