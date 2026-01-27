<template>
  <div class="radical-container">
    <!-- 顶部时间状态栏 -->
    <TimeBar />

    <div class="main-wrapper">
      <!-- 左侧边栏 -->
      <Sidebar />

      <!-- 主内容区 -->
      <MainContent />
    </div>

    <!-- 页脚 -->
    <Footer />

    <!-- 音乐播放器 -->
    <MusicPlayer />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { currentLanguage, setLanguage } from './locales';
import TimeBar from './components/TimeBar.vue';
import Sidebar from './components/Sidebar.vue';
import MainContent from './components/MainContent.vue';
import Footer from './components/Footer.vue';
import MusicPlayer from './components/MusicPlayer.vue';

// 根据路径初始化语言
onMounted(() => {
  const path = window.location.pathname;
  if (path === '/zh') {
    setLanguage('zh');
  } else if (path === '/jp') {
    setLanguage('jp');
  } else {
    setLanguage('en');
  }
});

// 监听语言变化，更新 URL
watch(currentLanguage, (newLang) => {
  const langPath = newLang === 'en' ? '' : `/${newLang}`;
  const newPath = langPath || '/';
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath);
  }
});
</script>

<style scoped>
/* 容器布局 */
.radical-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

/* 主包装器 */
.main-wrapper {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 40px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-wrapper {
    flex-direction: column;
  }
}
</style>
