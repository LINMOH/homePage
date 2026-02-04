<template>
  <main class="content">
    <!-- 根据当前页面显示不同内容 -->
    <HomeContent v-if="currentPage === 'home'" />
    <LogContent v-else-if="currentPage === 'log'" />
    <BlogContent v-else-if="currentPage === 'blog'" />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import HomeContent from './HomeContent.vue';
import LogContent from './LogContent.vue';
import BlogContent from './BlogContent.vue';

// 当前页面
const currentPage = ref('home');

// 处理页面切换
const handlePageSwitch = (event) => {
  const page = event.detail?.page;
  if (page && ['home', 'log', 'blog'].includes(page)) {
    currentPage.value = page;
    // 更新URL hash
    window.location.hash = page;
  }
};

// 监听页面切换事件
onMounted(() => {
  // 从URL hash获取初始页面
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'log', 'blog'].includes(hash)) {
    currentPage.value = hash;
  }
  
  // 监听自定义事件
  window.addEventListener('page-switch', handlePageSwitch);
});

onUnmounted(() => {
  window.removeEventListener('page-switch', handlePageSwitch);
});
</script>

<style scoped>
/* 主内容区 */
.content {
  flex: 1;
  overflow-y: auto;
}
</style>

