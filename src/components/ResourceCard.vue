<template>
  <a :href="item.link" target="_blank" rel="noopener noreferrer" class="activity-node">
    <div :class="['resource-card']" :style="{ background: item.gradient }">
      <div class="card-header">
        <span class="card-status">{{ item.status }}</span>
      </div>
      <div class="card-body">
        <h4 class="resource-title">{{ item.emoji }} {{ isGithubRepo && githubRepoName ? githubRepoName : item.title }}</h4>
        <p class="resource-desc">{{ isGithubRepo && githubDescription ? githubDescription : item.description }}</p>
      </div>
      <div class="card-footer">
        <div class="footer-left">
          <div class="author-info">
            <img 
              class="author-avatar" 
              :src="isGithubRepo && githubOwnerAvatar ? githubOwnerAvatar : item.authorAvatar" 
              :alt="isGithubRepo && githubOwnerName ? githubOwnerName : item.author" 
            />
            <span class="author-name">{{ isGithubRepo && githubOwnerName ? githubOwnerName : item.author }}</span>
          </div>
        </div>
        <div class="footer-right">
          <span v-if="item.isFollowerCard" class="follower-info">
            👥 {{ followerStats[item.vmid] === 0 ? '...' : followerStats[item.vmid] }} followers
          </span>
          <span v-else-if="item.isZhihuCard" class="follower-info">
            <span v-if="followerStats[item.userSlug] === 0">加载中...</span>
            <span v-else-if="followerStats[item.userSlug] === 'view-on-site'">访问原站</span>
            <span v-else>👥 {{ followerStats[item.userSlug] }} followers</span>
          </span>
          <span v-else-if="isGithubRepo" class="time-info">
            <span v-if="loading">Loading...</span>
            <span v-else>{{ displayTime }}</span>
          </span>
          <span v-else class="time-info">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useGithubRepo } from '../utils/githubApi.js';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  followerStats: {
    type: Object,
    default: () => ({})
  }
});

// 检查是否是GitHub仓库链接
const isGithubRepo = computed(() => {
  return props.item.link && props.item.link.includes('github.com');
});

// 使用组合式函数获取GitHub仓库信息
const { 
  displayTime, 
  loading, 
  ownerAvatar: githubOwnerAvatar, 
  owner: githubOwnerName,
  description: githubDescription,
  repoName: githubRepoName
} = useGithubRepo(props.item.link);
</script>

<style scoped>
.activity-node { 
  margin-bottom: 0; 
  width: 100%; 
  text-decoration: none; 
  display: block;
}

.activity-node:hover { 
  text-decoration: none; 
}

.resource-card {
  border-radius: 16px;
  padding: 20px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.resource-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left var(--transition-slow);
}

.resource-card:hover::before {
  left: 100%;
}

.resource-card:hover {
  transform: translateY(-8px) scale(1.02);
  filter: brightness(1.1);
  box-shadow: var(--shadow-2xl);
}

.card-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.card-status {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  width: fit-content;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 12px;
}

.resource-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
  line-height: 1.3;
  font-family: var(--font-futura);
}

.resource-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-left {
  display: flex;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.author-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.footer-right {
  display: flex;
  align-items: center;
}

.time-info {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.follower-info {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 手机端适配 */
@media (max-width: 480px) {
  .resource-card {
    padding: 16px;
    min-height: 160px;
  }

  .resource-title {
    font-size: 1.1rem;
  }

  .resource-desc {
    font-size: 0.8rem;
  }

  .card-footer {
    padding-top: 8px;
  }

  .author-avatar {
    width: 24px;
    height: 24px;
  }

  .author-name,
  .time-info,
  .follower-info {
    font-size: 0.75rem;
  }
}
</style>
