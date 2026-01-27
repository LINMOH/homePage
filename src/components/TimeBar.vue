<template>
  <header class="time-bar">
    <div class="time-display">{{ currentTime }}</div>
    <div class="controls">
      <div class="language-dropdown" ref="dropdownRef">
        <button class="dropdown-trigger" @click="toggleDropdown">
          <img :src="getPublicPath(currentLang.flag)" class="flag-icon" />
          <span>{{ currentLang.shortCode }}</span>
        </button>
        <div class="dropdown-menu" v-show="isDropdownOpen">
          <div 
            v-for="lang in languages" 
            :key="lang.code" 
            class="dropdown-item"
            @click="selectLanguage(lang.code)"
          >
            <img :src="getPublicPath(lang.flag)" class="flag-icon" />
            <span>{{ lang.shortCode }}</span>
          </div>
        </div>
      </div>
      <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
        <i class="fa-solid fa-sun" v-if="isDarkMode"></i>
        <i class="fa-solid fa-moon" v-else></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { languages, setLanguage, currentLanguage, getPublicPath } from '../locales';

// 时间显示
const currentTime = ref('');
let timer = null;

// 主题切换
const isDarkMode = ref(true);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// 语言切换
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const currentLang = computed(() => {
  const lang = languages.find(l => l.code === currentLanguage.value);
  return lang || languages.find(l => l.code === 'en');
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectLanguage = (code) => {
  setLanguage(code);
  isDropdownOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);

  // 初始化主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* 顶部时间状态栏：极简主义风格 */
.time-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px var(--pad-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-dropdown {
  position: relative;
}

.dropdown-trigger {
  background: var(--bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-family);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-trigger:hover {
  border-color: var(--text-sub);
}

.dropdown-trigger:focus {
  border-color: var(--accent);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg);
  border: 1px solid var(--border-color);
  min-width: 100px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--border-color);
}

.flag-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  color: var(--text-main);
  transition: opacity 0.2s ease;
}

.theme-toggle:hover {
  opacity: 0.7;
}

.time-display {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-main);
  font-variant-numeric: tabular-nums;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .time-display {
    font-size: 10px;
  }
}
</style>
