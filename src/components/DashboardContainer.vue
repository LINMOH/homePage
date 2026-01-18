<template>
  <div class="dashboard-container">
    <HamburgerMenu :user="user" :follower-stats="followerStats" />
    <div class="content-wrapper">
      <UserProfile :user="user" :follower-stats="followerStats" />
      <main class="main-content">
        <ActivityFeed 
          :categories="categories" 
          :follower-stats="followerStats" 
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import UserProfile from './UserProfile.vue';
import ActivityFeed from './ActivityFeed.vue';
import HamburgerMenu from './HamburgerMenu.vue';

defineProps({
  user: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  followerStats: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  color: var(--text-primary);
  font-family: var(--font-family);
  position: relative;
  z-index: 1;
}

/* 汉堡菜单按钮位置 */
.dashboard-container :deep(.hamburger-menu) {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: auto;
  height: auto;
}

.dashboard-container :deep(.hamburger-menu > *) {
  pointer-events: auto;
}

@media (min-width: 1101px) {
  .dashboard-container :deep(.hamburger-menu) {
    display: none;
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  position: relative;
  gap: 0;
}

.main-content { 
  flex: 1; 
  padding: 0 60px 40px 60px; 
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

/* 响应式：扫描式阅读优化 */
@media (max-width: 1100px) {
  .main-content { 
    margin-left: 260px; 
    padding: 20px 30px; 
  }
}

/* 平板适配 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .main-content {
    padding: 20px;
    margin-left: 0;
    padding-top: 60px; /* 为汉堡菜单留出空间 */
  }
}

/* 手机端适配 */
@media (max-width: 480px) {
  .dashboard-container {
    min-height: 100vh;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .main-content {
    padding: 16px;
    margin-left: 0;
  }
}
</style>
