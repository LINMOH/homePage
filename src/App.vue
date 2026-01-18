<template>
  <div class="app-container">
    <ParticleBackground />
    <AudioPlayer ref="audioPlayer" />
    <DashboardContainer
      :user="user"
      :categories="processedCategories"
      :follower-stats="followerStats"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { userData } from './data/user.js';
import { categoriesData } from './data/categories.js';
import { fetchAllFollowers } from './api/index.js';
import DashboardContainer from './components/DashboardContainer.vue';
import ParticleBackground from './components/ParticleBackground.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import './styles/variables.css';
import './styles/global.css';
import './styles/fonts.css';

const audioPlayer = ref(null);

// 模拟用户信息数据
const user = ref(userData);

const currentTab = ref('all');
const tabs = ['all'];

// 分类内容数据
const categories = ref(categoriesData);

// 粉丝数据缓存（Bilibili和知乎）
const followerStats = ref({});

// 获取所有分类名称
const allCategories = computed(() => {
  return Object.keys(categories.value);
});

// 获取当前分类的数据
const filteredActivities = computed(() => {
  if (currentTab.value === 'all') {
    // 如果是all,返回所有分类的数据
    return allCategories.value.flatMap(category => categories.value[category] || []);
  }
  // 否则返回指定分类的数据
  return categories.value[currentTab.value] || [];
});

// 初始化时获取所有粉丝数
const initBilibiliFollowers = async () => {
  const allFollowers = await fetchAllFollowers(filteredActivities.value);
  followerStats.value = allFollowers;
};

// 处理分类数据
const processedCategories = computed(() => {
  const categoryOrder = ['projects', 'website', 'teams', 'Contact'];
  const sortedCategories = allCategories.value.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

  return sortedCategories.map(category => ({
    name: category,
    title: formatCategoryName(category),
    icon: getCategoryIcon(category),
    items: categories.value[category] || []
  }));
});

// 格式化分类名称
const formatCategoryName = (category) => {
  const nameMap = {
    website: 'Website',
    projects: 'Projects',
    teams: 'Teams',
    Contact: 'Contact'
  };
  return nameMap[category] || category;
};

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    website: 'fas fa-globe',
    projects: 'fas fa-folder',
    teams: 'fas fa-users',
    Contact: 'fas fa-envelope'
  };
  return iconMap[category] || 'fas fa-tag';
};

// 组件挂载时初始化Bilibili粉丝数
onMounted(() => {
  initBilibiliFollowers();
});
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}
</style>
