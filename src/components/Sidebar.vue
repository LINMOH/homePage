<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <div class="avatar-section">
        <img :src="getPublicPath(content.site.logo)" :alt="content.site.name" class="avatar" />
        <h1 class="user-name">{{ content.sidebar.userName }}</h1>
        <p class="user-handle">{{ content.sidebar.userHandle }}</p>
      </div>

      <!-- 导航按钮 -->
      <nav class="sidebar-nav">
        <button 
          v-for="(navItem, index) in navItems" 
          :key="navItem.id"
          class="nav-button"
          :class="{ 'active': activeNav === navItem.id }"
          @click="switchPage(navItem.id)"
        >
          <span class="nav-number">0{{ index + 1 }}</span>
          <span class="nav-label">{{ navItem.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <p class="location">{{ content.sidebar.location }}</p>
        <p class="bio">{{ content.sidebar.bio }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
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

// 当前激活的导航项
const activeNav = ref('home');

// 导航项配置
const navItems = computed(() => {
  const navContent = content.value.sidebar.navigation || {};
  return [
    { id: 'home', label: navContent.home || 'Home' },
    { id: 'log', label: navContent.log || 'Log' },
    { id: 'blog', label: navContent.blog || 'Blog' }
  ];
});

// 切换页面
const switchPage = (pageId) => {
  activeNav.value = pageId;
  // 触发自定义事件，通知父组件切换页面
  window.dispatchEvent(new CustomEvent('page-switch', { 
    detail: { page: pageId }
  }));
};

// 监听页面切换事件
onMounted(() => {
  // 从URL hash获取当前页面
  const hash = window.location.hash.replace('#', '');
  if (hash && ['', 'log', 'blog'].includes(hash)) {
    activeNav.value = hash;
  }
  
  // 监听hash变化
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '');
    if (newHash && ['home', 'log', 'blog'].includes(newHash)) {
      activeNav.value = newHash;
    }
  });
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

/* 导航样式 */
.sidebar-nav {
  margin: var(--pad-lg) 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: var(--pad-sm);
  padding: var(--pad-sm) var(--pad-md);
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.nav-button:hover {
  background: var(--bg);
  border-left-color: var(--border-color);
}

.nav-button.active {
  background: var(--bg);
  border-left-color: var(--accent);
}

.nav-button.active .nav-number {
  color: var(--accent);
}

.nav-button.active .nav-label {
  color: var(--text-main);
  font-weight: 600;
}

.nav-number {
  font-size: 10px;
  color: var(--text-sub);
  font-weight: bold;
  min-width: 20px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.nav-label {
  font-size: 14px;
  color: var(--text-sub);
  transition: color 0.2s ease;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.nav-button:hover .nav-label {
  color: var(--text-main);
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

  .sidebar-nav {
    flex-direction: row;
    justify-content: center;
    margin: var(--pad-md) 0;
  }

  .nav-button {
    flex-direction: column;
    border-left: none;
    border-bottom: 2px solid transparent;
    padding: var(--pad-xs) var(--pad-sm);
  }

  .nav-button:hover {
    border-left-color: transparent;
    border-bottom-color: var(--border-color);
  }

  .nav-button.active {
    border-left-color: transparent;
    border-bottom-color: var(--accent);
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

  .nav-button {
    padding: var(--pad-xs);
  }

  .nav-label {
    font-size: 12px;
  }
}
</style>