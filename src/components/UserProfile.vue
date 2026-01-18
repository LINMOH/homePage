<template>
  <aside class="sidebar">
    <div class="user-profile">
      <div class="avatar-container">
        <img :src="user.avatar" alt="User Avatar" class="avatar" />
        <div class="status-indicator"></div>
      </div>
      <h1 class="user-name">{{ user.name }}</h1>
      <p class="user-handle">@{{ user.handle }}</p>

      <div class="user-location">
        <i class="fas fa-map-pin"></i>
        <span>{{ user.location }}</span>
      </div>

      <nav class="secondary-nav">
        <a v-for="link in user.navLinks" :key="link.label" class="nav-link" :href="link.url" target="_blank" rel="noopener noreferrer">
          <i :class="link.icon"></i> 
          <span class="nav-link-label">{{ link.label }}</span>
          <span v-if="link.icon.includes('bilibili') && bilibiliFollowers" class="follower-count">
            {{ bilibiliFollowers }} followers
          </span>
        </a>
      </nav>

      <div class="interest-tag-box">
        <h3>{{ user.interestTitle }}</h3>
        <p>{{ user.bio }}</p>
      </div>

      <div class="license-box">
        <img 
          src="https://s1.imagehub.cc/images/2026/01/18/b4ab1d8d4a49b8a97feba3652c68b5ac.png" 
          alt="License" 
          class="license-image"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  followerStats: {
    type: Object,
    default: () => ({})
  }
});

// 获取哔哩哔哩粉丝数
const bilibiliFollowers = computed(() => {
  const vmid = 2126856300;
  return props.followerStats[vmid] || null;
});
</script>

<style scoped>
.sidebar {
  width: 320px;
  background: linear-gradient(to right, transparent, var(--bg-secondary));
  padding: 40px 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  backdrop-filter: blur(12px);
  z-index: 10;
  flex-shrink: 0;
  margin: -40px 0;
  padding-top: 80px;
  transition: background var(--transition-base);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .sidebar {
    display: none;
  }
}

.avatar-container { 
  position: relative; 
  width: 140px; 
  margin-bottom: 20px; 
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar { 
  width: 100%; 
  border-radius: 50%; 
  border: 4px solid var(--border-color); 
  transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.status-indicator {
  position: absolute; 
  bottom: 8px; 
  right: 12px;
  width: 18px; 
  height: 18px; 
  background: var(--success);
  border: 3px solid var(--bg-primary); 
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-container:hover .status-indicator {
  transform: scale(1.2);
}

.user-name { 
  font-size: 1.5rem; 
  font-weight: 700; 
  margin-bottom: 4px; 
  text-align: left; 
  color: var(--text-primary);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-optima);
}

.user-handle { 
  color: var(--text-secondary);
  font-size: 0.9rem; 
  margin-bottom: 24px; 
  text-align: left; 
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-location {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 24px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-location i { 
  font-size: 0.85rem; 
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-location:hover i {
  color: var(--primary-color);
  transform: scale(1.1);
}

.user-profile {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.secondary-nav { 
  text-align: left; 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.nav-link { 
  text-align: left; 
  text-decoration: none; 
  color: var(--text-primary);
  display: flex; 
  align-items: center; 
  gap: 8px; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  font-size: 0.9rem; 
  word-break: break-word; 
  padding: 8px 12px;
  border-radius: 8px;
}

.nav-link i { 
  width: 16px; 
  text-align: center; 
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  flex-shrink: 0; 
}

.nav-link:hover { 
  color: var(--primary-color);
  background: var(--bg-card);
  transform: translateX(4px);
}

.nav-link:hover i { 
  color: var(--primary-color);
  transform: scale(1.1);
}

.nav-link-label {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.follower-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.nav-link:hover .follower-count {
  color: var(--primary-color);
  background: var(--bg-card);
}

.interest-tag-box { 
  text-align: left; 
  padding: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 20px;
}

.interest-tag-box:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.interest-tag-box h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 1rem;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interest-tag-box p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: var(--line-height-base);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.license-box {
  margin-top: auto;
  margin-bottom: 20px;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 20px;
}

.license-box:hover {
  transform: scale(1.05);
}

.license-image {
  width: 100px;
  height: auto;
  display: inline-block;
  border-radius: 8px;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.license-image:hover {
  box-shadow: var(--shadow-md);
}

/* 响应式：扫描式阅读优化 */
@media (max-width: 1100px) {
  .sidebar { width: 260px; padding: 20px; }
}

/* 平板适配 */
@media (max-width: 1100px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    margin: 0;
    padding: 30px 20px;
  }
}

/* 手机端适配 */
@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    margin: 0;
    padding: 24px 16px;
  }

  .avatar-container {
    width: 100px;
    margin: 0 auto 16px;
  }

  .user-name {
    font-size: 1.25rem;
    text-align: center;
  }

  .user-handle {
    text-align: center;
    font-size: 0.85rem;
    margin-bottom: 16px;
  }

  .user-location {
    justify-content: center;
    margin-bottom: 16px;
  }

  .secondary-nav {
    gap: 10px;
  }

  .nav-link {
    font-size: 0.85rem;
    justify-content: center;
  }

  .interest-tag-box {
    text-align: center;
  }
}
</style>
