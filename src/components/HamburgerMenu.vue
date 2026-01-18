<template>
  <div class="hamburger-menu" @click.stop>
    <button 
      class="hamburger-button" 
      @click="toggleMenu"
      :class="{ 'active': isOpen }"
      aria-label="Toggle menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <div class="menu-overlay" :class="{ 'active': isOpen }" @click="toggleMenu"></div>

    <nav class="menu-content" :class="{ 'active': isOpen }">
      <div class="menu-header">
        <div class="avatar-container">
          <img :src="user.avatar" alt="User Avatar" class="avatar" />
        </div>
        <h2 class="user-name">{{ user.name }}</h2>
        <p class="user-handle">@{{ user.handle }}</p>
      </div>

      <div class="menu-section">
        <h3 class="section-title">联系方式</h3>
        <a 
          v-for="link in user.navLinks" 
          :key="link.label" 
          class="menu-link" 
          :href="link.url" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
          <span v-if="link.icon.includes('bilibili') && bilibiliFollowers" class="follower-count">
            {{ bilibiliFollowers }}
          </span>
        </a>
      </div>

      <div class="menu-section">
        <h3 class="section-title">{{ user.interestTitle }}</h3>
        <p class="section-content">{{ user.bio }}</p>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// 获取哔哩哔哩粉丝数
const bilibiliFollowers = computed(() => {
  const vmid = 2126856300;
  return props.followerStats[vmid] || null;
});
</script>

<style scoped>
.hamburger-menu {
  position: relative;
  z-index: 1000;
  pointer-events: none;
}

.hamburger-menu > * {
  pointer-events: auto;
}

.hamburger-button {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: var(--text-primary);
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-button.active .hamburger-line:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}

.hamburger-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-button.active .hamburger-line:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
}

.menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.menu-overlay.active {
  display: block;
}

.menu-content {
  display: none;
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background: var(--bg-primary);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
  z-index: 1000;
}

.menu-content.active {
  display: block;
  right: 0;
}

.menu-header {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 24px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--border-color);
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-handle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.section-content {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.menu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  background: var(--bg-card);
}

.menu-link:hover {
  background: var(--bg-card-hover);
  transform: translateX(-4px);
}

.menu-link i {
  font-size: 1.125rem;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.menu-link span:first-of-type {
  flex: 1;
}

.follower-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: 12px;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .hamburger-button {
    display: flex;
  }
}
</style>
