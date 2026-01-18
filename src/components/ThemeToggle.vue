<template>
  <button 
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="isDark ? '切换到亮色主题' : '切换到暗色主题'"
  >
    <div class="toggle-track">
      <div class="toggle-thumb" :class="{ 'dark-mode': isDark }">
        <transition name="icon-fade" mode="out-in">
          <i 
            :key="isDark ? 'moon' : 'sun'" 
            :class="isDark ? 'fas fa-moon' : 'fas fa-sun'"
            class="theme-icon"
          ></i>
        </transition>
      </div>
    </div>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = prefersDark;
  }

  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
});
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 32px;
  border-radius: 16px;
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 1000;
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-lg);
  padding: 2px;
}

.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-light) 100%);
  opacity: 0.3;
  transition: opacity var(--transition-base);
}

.theme-toggle:hover .toggle-track {
  opacity: 0.5;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.toggle-thumb.dark-mode {
  transform: translateX(28px);
}

.theme-icon {
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

/* 图标淡入淡出动画 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

/* 响应式 */
@media (max-width: 768px) {
  .theme-toggle {
    width: 52px;
    height: 28px;
    top: 16px;
    right: 16px;
  }

  .toggle-thumb {
    width: 20px;
    height: 20px;
  }

  .toggle-thumb.dark-mode {
    transform: translateX(24px);
  }

  .theme-icon {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .theme-toggle {
    width: 48px;
    height: 26px;
    top: 12px;
    right: 12px;
  }

  .toggle-thumb {
    width: 18px;
    height: 18px;
  }

  .toggle-thumb.dark-mode {
    transform: translateX(22px);
  }

  .theme-icon {
    font-size: 0.7rem;
  }
}
</style>
