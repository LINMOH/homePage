<template>
  <main class="content">
    <!-- 动态标题区 -->
    <section class="hero">
      <h1 class="massive-title">{{ content.log.title }}</h1>
      <p class="subtitle">GitHub Issues / {{ issues.length }} updates</p>
    </section>

    <!-- 加载状态 -->
    <section v-if="loading" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.log.loading }}</h2>
      </div>
      <div class="loading-content">
        <div class="loading-spinner"></div>
      </div>
    </section>

    <!-- 错误状态 -->
    <section v-else-if="error" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.log.error }}</h2>
      </div>
      <div class="error-content">
        <p>{{ error }}</p>
        <button @click="refresh" class="retry-btn">
          {{ content.log.loading }}
        </button>
      </div>
    </section>

    <!-- 无数据状态 -->
    <section v-else-if="!hasIssues" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ content.log.noIssues }}</h2>
      </div>
    </section>

    <!-- 动态列表 -->
    <section v-else class="log-list">
      <div 
        v-for="(issue, index) in issues" 
        :key="issue.id" 
        class="log-item"
      >
        <div class="log-header">
          <div class="log-meta">
            <span class="log-number">00{{ index + 1 }}</span>
            <span class="log-date">{{ issue.time_ago }}</span>
          </div>
          <h2 class="log-title">{{ issue.title }}</h2>
          <div class="log-info">
            <span class="log-user">@{{ issue.user.login }}</span>
            <span class="log-state" :class="issue.state">{{ issue.state }}</span>
            <span class="log-comments">{{ issue.comments }} comments</span>
          </div>
        </div>
        
        <div class="log-body" v-html="renderMarkdown(issue.body)"></div>
        
        <div class="log-footer">
          <a 
            :href="issue.html_url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="log-link"
          >
            {{ content.log.viewOnGitHub }}
          </a>
          <span class="log-full-date">{{ issue.formatted_date }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { currentLanguage } from '../locales';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// 导入你定义的逻辑 (假设文件名是 useGitHub.js)
import { useGitHubIssues } from '../api/issues.js'; 

// 1. 基础配置
const GITHUB_API_URL = 'https://api.github.com/repos/LINMOH/homePage/issues';

// 2. 国际化内容映射
const content = computed(() => {
  const lang = currentLanguage.value;
  const dict = { zh: zhCN, jp: jaJP, en: enUS };
  return dict[lang] || enUS;
});

// 3. 配置 Markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; 
  }
});

// 4. 调用 Composable 获取真实数据
const { 
  issues, 
  loading, 
  error, 
  hasIssues, 
  refresh 
} = useGitHubIssues(GITHUB_API_URL);

// 渲染 Markdown 辅助函数
const renderMarkdown = (text) => (text ? md.render(text) : '');

// 5. 生命周期管理
onMounted(() => {
  refresh(); // 组件挂载时抓取数据
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
}

.subtitle {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 加载状态 */
.loading-content {
  padding: var(--pad-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-content {
  padding: var(--pad-lg);
  text-align: center;
}

.error-content p {
  margin-bottom: var(--pad-md);
  color: var(--text-sub);
}

.retry-btn {
  background: var(--text-main);
  color: var(--bg);
  border: none;
  padding: 12px 24px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.retry-btn:hover {
  background: var(--accent);
}

/* 动态列表 */
.log-list {
  border-bottom: 1px solid var(--border-color);
}

.log-item {
  padding: var(--pad-lg);
  border-bottom: 1px solid var(--border-color);
}

.log-item:last-child {
  border-bottom: none;
}

.log-header {
  margin-bottom: var(--pad-md);
}

.log-meta {
  display: flex;
  align-items: center;
  gap: var(--pad-sm);
  margin-bottom: var(--pad-xs);
}

.log-number {
  font-size: 10px;
  color: var(--accent);
  font-weight: bold;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-date {
  font-size: 10px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: var(--pad-xs);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-info {
  display: flex;
  align-items: center;
  gap: var(--pad-sm);
  font-size: 12px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-user {
  color: var(--accent);
}

.log-state {
  padding: 2px 8px;
  border: 1px solid var(--border-color);
  text-transform: uppercase;
  font-size: 10px;
}

.log-state.open {
  color: #3FA36C;
  border-color: #3FA36C;
}

.log-state.closed {
  color: #C63636;
  border-color: #C63636;
}

.log-comments {
  margin-left: auto;
}

/* Markdown内容样式 */
.log-body {
  margin-bottom: var(--pad-md);
  line-height: 1.6;
  color: var(--text-main);
}

.log-body :deep(h1),
.log-body :deep(h2),
.log-body :deep(h3) {
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  margin: var(--pad-md) 0 var(--pad-sm) 0;
  font-weight: 800;
}

.log-body :deep(h1) {
  font-size: 24px;
}

.log-body :deep(h2) {
  font-size: 20px;
}

.log-body :deep(h3) {
  font-size: 16px;
}

.log-body :deep(p) {
  margin-bottom: var(--pad-sm);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-body :deep(ul),
.log-body :deep(ol) {
  margin-bottom: var(--pad-sm);
  padding-left: var(--pad-md);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-body :deep(li) {
  margin-bottom: 4px;
}

.log-body :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding-left: var(--pad-sm);
  margin: var(--pad-sm) 0;
  color: var(--text-sub);
  font-style: italic;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-body :deep(code) {
  background: var(--bg);
  padding: 2px 4px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.log-body :deep(pre) {
  background: var(--bg);
  border: 1px solid var(--border-color);
  padding: var(--pad-sm);
  margin: var(--pad-sm) 0;
  overflow-x: auto;
}

.log-body :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
}

.log-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
}

.log-body :deep(a:hover) {
  opacity: 0.7;
}

/* 页脚 */
.log-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--pad-sm);
  border-top: 1px solid var(--border-color);
}

.log-link {
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.log-link:hover {
  text-decoration: underline;
}

.log-full-date {
  font-size: 10px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .massive-title {
    font-size: 80px;
  }
}

@media (max-width: 768px) {
  .massive-title {
    font-size: 60px;
  }
  
  .log-title {
    font-size: 20px;
  }
  
  .log-info {
    flex-wrap: wrap;
  }
  
  .log-comments {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .massive-title {
    font-size: 40px;
  }
  
  .log-title {
    font-size: 18px;
  }
  
  .log-body :deep(h1) {
    font-size: 20px;
  }
  
  .log-body :deep(h2) {
    font-size: 18px;
  }
  
  .log-body :deep(h3) {
    font-size: 16px;
  }
}
</style>