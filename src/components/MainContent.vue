<template>
  <main class="content">
    <!-- 英雄区：巨大的留白与极端的字号对比 -->
    <section class="hero">
      <h1 class="massive-title" v-html="typedTitle"></h1>
      <p class="subtitle">{{ content.hero.subtitle }}</p>
    </section>

    <!-- 关于部分 -->
    <section id="about" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.about.title }}</h2>
      </div>
      <div class="about-content">
        <p class="about-text" v-html="content.about.text"></p>
        <div class="stats-grid">
          <div v-for="(stat, index) in content.about.stats" :key="index" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能部分 -->
    <section id="skills" class="section" ref="skillSectionRef">
      <div class="section-header">
        <h2 class="section-title">{{ content.skills.title }}</h2>
      </div>
      <div class="skills-grid">
        <div v-for="(skill, index) in content.skills.items" :key="skill.id" class="skill-item">
          <div class="skill-number">00{{ index + 1 }}</div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-desc">{{ skill.description }}</p>
          <div class="skill-level">
            <div class="skill-bar">
              <div 
                class="skill-progress" 
                :class="{ 'animate': isSkillsVisible }"
                :style="{ '--progress-width': skill.level + '%' }"
              ></div>
            </div>
            <span class="skill-percent">{{ skill.level }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 网站项目部分 -->
    <section id="websites" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.websites.title }}</h2>
      </div>
      <div class="grid">
        <a
          v-for="(site, index) in content.websites.items"
          :key="site.id"
          :href="site.link"
          target="_blank"
          rel="noopener noreferrer"
          class="card"
        >
          <div class="card-meta">00{{ index + 1 }} / {{ site.status }}</div>
          <h3 class="card-title">{{ site.title }}</h3>
          <p class="card-desc">{{ site.description }}</p>
        </a>
      </div>
    </section>

    <!-- 项目部分 -->
    <section id="projects" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.projects.title }}</h2>
      </div>
      <div class="grid">
        <a
          v-for="(project, index) in content.projects.items"
          :key="project.id"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="card"
        >
          <div class="card-meta">00{{ index + 1 }} / {{ project.status }}</div>
          <h3 class="card-title">{{ project.title }}</h3>
          <p class="card-desc">{{ getProjectDescription(project) }}</p>
          <div v-if="project.link && project.link.includes('github.com')" class="github-stats">
            <div class="github-stat">
              <i class="fa-solid fa-star github-icon"></i>
              <span class="github-value">{{ getProjectInfo(project.id)?.stars || 0 }}</span>
            </div>
            <div class="github-stat">
              <i class="fa-solid fa-code-fork github-icon"></i>
              <span class="github-value">{{ getProjectInfo(project.id)?.forks || 0 }}</span>
            </div>
            <div class="github-stat">
              <i class="fa-solid fa-circle github-icon"></i>
              <span class="github-value">{{ getProjectInfo(project.id)?.language || 'N/A' }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- 团队部分 -->
    <section id="team" class="section" ref="teamSectionRef">
      <div class="section-header">
        <h2 class="section-title">{{ content.team.title }}</h2>
      </div>
      <div class="about-content">
        <div class="team-logo" :class="{ 'animate': isTeamVisible }">
          <a href="https://taten.xyz/" target="_blank" rel="noopener noreferrer" class="team-logo-link">
            <img :src="getPublicPath(content.team.logo)" :alt="content.team.title" />
          </a>
        </div>
        <p class="about-text" v-html="content.team.text"></p>
        <div class="stats-grid">
          <div v-for="(stat, index) in content.team.stats" :key="index" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系方式部分 -->
    <section id="contact" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.contact.title }}</h2>
      </div>
      <div class="grid">
        <a
          v-for="(contact, index) in content.contact.items"
          :key="contact.id"
          :href="contact.link"
          target="_blank"
          rel="noopener noreferrer"
          class="card"
        >
          <div class="card-meta">00{{ index + 1 }} / {{ contact.type }}</div>
          <h3 class="card-title">{{ contact.title }}</h3>
          <p class="card-desc">{{ contact.description }}</p>
        </a>
      </div>
    </section>

    <!-- 评论部分 -->
    <GiscusComments />
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { currentLanguage, getPublicPath } from '../locales';
import { useGithubRepo } from '../api/github.js';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';
import GiscusComments from './GiscusComments.vue';

// 根据当前语言获取内容
const content = computed(() => {
  const lang = currentLanguage.value;
  if (lang === 'zh') return zhCN;
  if (lang === 'jp') return jaJP;
  return enUS;
});

const typedTitle = ref('');
const fullTitle = computed(() => content.value.hero?.title || '');
let currentIndex = 0;

const typeWriter = () => {
  typedTitle.value = '';
  currentIndex = 0;

  const typeNextChar = () => {
    if (currentIndex < fullTitle.value.length) {
      typedTitle.value += fullTitle.value.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeNextChar, 100);
    }
  };

  typeNextChar();
};

// 技能进度条动画
const skillSectionRef = ref(null);
const isSkillsVisible = ref(false);

// TATEN logo 动画
const teamSectionRef = ref(null);
const isTeamVisible = ref(false);

// GitHub 项目信息
const githubProjects = ref([]);

// 初始化 GitHub 项目信息
const initializeGithubProjects = () => {
  githubProjects.value = [];
  content.value.projects?.items?.forEach(project => {
    if (project.link && project.link.includes('github.com')) {
      const projectInfo = useGithubRepo(project.link);
      githubProjects.value.push({
        id: project.id,
        ...projectInfo
      });
    }
  });
};

// 监听语言变化，重新初始化 GitHub 项目和打字效果
watch(currentLanguage, () => {
  initializeGithubProjects();
  typeWriter();
}, { immediate: true });

const checkSkillsVisibility = () => {
  if (skillSectionRef.value) {
    const rect = skillSectionRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;

    if (isVisible && !isSkillsVisible.value) {
      isSkillsVisible.value = true;
      // 移除事件监听器，避免不必要的检查
      window.removeEventListener('scroll', checkSkillsVisibility);
      window.removeEventListener('resize', checkSkillsVisibility);
    }
  }
};

const checkTeamVisibility = () => {
  if (teamSectionRef.value) {
    const rect = teamSectionRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;

    if (isVisible && !isTeamVisible.value) {
      isTeamVisible.value = true;
    }
  }
};

// 获取项目的 GitHub 信息
const getProjectInfo = (projectId) => {
  return githubProjects.value.find(p => p.id === projectId);
};

// 获取项目描述，优先使用 GitHub API 的描述
const getProjectDescription = (project) => {
  if (project.link && project.link.includes('github.com')) {
    const info = getProjectInfo(project.id);
    if (info && info.description) {
      return info.description;
    }
  }
  return project.description;
};

onMounted(() => {
  // 添加滚动监听
  window.addEventListener('scroll', checkSkillsVisibility);
  window.addEventListener('resize', checkSkillsVisibility);
  window.addEventListener('scroll', checkTeamVisibility);
  window.addEventListener('resize', checkTeamVisibility);

  // 初始检查
  setTimeout(checkSkillsVisibility, 100);
  setTimeout(checkTeamVisibility, 100);
});
</script>

<style scoped>
/* 英雄区：巨大的留白与极端的字号对比 */
.hero {
  padding: var(--pad-lg);
  border-bottom: 1px solid var(--border-color);
}

.massive-title {
  font-size: 120px;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -5px;
  margin-bottom: 40px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  position: relative;
}

.massive-title::after {
  content: '|';
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.subtitle {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 区块样式 */
.section {
  border-bottom: 1px solid var(--border-color);
}

.section-header {
  padding: 40px var(--pad-lg);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--text-main);
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--bg);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 关于部分样式 */
.about-content {
  padding: var(--pad-lg);
}

.about-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-sub);
  margin-bottom: var(--pad-lg);
  text-align: justify;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.about-text :deep(.taten-link) {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  transition: opacity 0.2s ease;
}

.about-text :deep(.taten-link:hover) {
  opacity: 0.7;
}

.team-logo {
  margin-bottom: var(--pad-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.team-logo.animate {
  opacity: 1;
  transform: translateY(0);
}

.team-logo-link {
  display: inline-block;
  transition: opacity 0.2s ease;
}

.team-logo-link:hover {
  opacity: 0.7;
}

.team-logo-link img {
  max-width: 200px;
  height: auto;
  border: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--pad-md);
}

.stat-item {
  padding: var(--pad-md);
  border: 1px solid var(--border-color);
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 900;
  color: var(--text-main);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 2px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 技能部分样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.skill-item {
  padding: var(--pad-lg);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.skill-item:nth-child(even) {
  border-right: none;
}

.skill-number {
  font-size: 10px;
  color: var(--accent);
  font-weight: bold;
  margin-bottom: var(--pad-sm);
}

.skill-name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: var(--pad-xs);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.skill-desc {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: var(--pad-md);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: var(--pad-sm);
}

.skill-bar {
  flex: 1;
  height: 2px;
  background: var(--border-color);
}

.skill-progress {
  height: 100%;
  background: var(--accent);
  width: 0;
}

.skill-progress.animate {
  animation: progressAnimation 1.5s ease-out forwards;
}

@keyframes progressAnimation {
  from {
    width: 0;
  }
  to {
    width: var(--progress-width, 100%);
  }
}

.skill-percent {
  font-size: 10px;
  color: var(--accent);
  font-weight: bold;
  min-width: 40px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 网格与卡片：纯二维框线 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.card {
  padding: 40px;
  border: 1px solid var(--border-color);
  outline: 1px solid var(--border-color);
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-decoration: none;
  color: var(--text-main);
}

.card:hover .card-title {
  color: var(--accent);
}

.card-meta {
  font-size: 10px;
  color: var(--accent);
  font-weight: bold;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.card-title {
  font-size: 24px;
  font-weight: 800;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.card-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.github-stats {
  display: flex;
  gap: var(--pad-sm);
  margin-top: var(--pad-sm);
  flex-wrap: wrap;
}

.github-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.github-icon {
  color: var(--accent);
  font-size: 14px;
}

.github-value {
  font-weight: 500;
}

/* 主内容区 */
.content {
  flex: 1;
  overflow-y: auto;
}

/* 响应式调整：依然保持线框逻辑 */
@media (max-width: 1024px) {
  .massive-title {
    font-size: 80px;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-item:nth-child(even) {
    border-right: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .massive-title {
    font-size: 60px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    border-right: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-item:nth-child(even) {
    border-right: none;
  }
}

@media (max-width: 480px) {
  .massive-title {
    font-size: 40px;
  }

  .section-title {
    font-size: 20px;
  }

  .card-title {
    font-size: 20px;
  }

  .stat-number {
    font-size: 24px;
  }

  .skill-name {
    font-size: 16px;
  }
}
</style>
