<template>
  <main class="content">
    <section class="hero">
      <h1 class="massive-title">{{ content.blog.title }}</h1>
      <p class="subtitle">Personal Thoughts & Technical Notes</p>
    </section>

    <section v-if="!currentPostId" class="blog-list">
      <div v-if="loading" class="loading-section">
        <div class="loading-content"><div class="loading-spinner"></div></div>
      </div>

      <div v-else-if="!hasPosts" class="empty-section">
        <div class="section-header">
          <h2 class="section-title">{{ content.blog.noPosts }}</h2>
        </div>
      </div>

      <div v-else>
        <div class="section-header">
          <h2 class="section-title">All Posts / {{ posts.length }}</h2>
        </div>
        <div class="posts-grid">
          <div 
            v-for="(item, index) in posts" 
            :key="item.id" 
            class="post-card"
            @click="selectPost(item.id)"
          >
            <div class="post-meta">
              <span class="post-number">{{ String(index + 1).padStart(3, '0') }}</span>
              <span class="post-date">{{ item.date }}</span>
            </div>
            <h3 class="post-title">{{ item.title }}</h3>
            <p class="post-excerpt">{{ item.excerpt }}</p>
            <div class="post-tags">
              <span v-for="tag in item.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>
            <div class="post-footer">
              <span class="read-more">{{ content.blog.readMore }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="blog-detail">
      <div v-if="loading" class="loading-content">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="post">
        <div class="detail-header">
          <button @click="backToList" class="back-btn">
            ← {{ content.blog.backToList }}
          </button>
          <div class="detail-meta">
            <span class="detail-date">{{ post.date }}</span>
            <span v-if="post.readTime" class="detail-read-time">{{ post.readTime }}</span>
          </div>
        </div>
        
        <article class="post-content">
          <h1 class="post-title-large">{{ post.title }}</h1>
          <div class="post-tags-large">
            <span v-for="tag in post.tags" :key="tag" class="post-tag-large">
              {{ tag }}
            </span>
          </div>
          <div class="post-body" v-html="post.htmlContent"></div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { currentLanguage } from '../locales';
import { useBlogPosts } from '../api/blogs.js';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';

// 1. 语言切换逻辑
const content = computed(() => {
  const lang = currentLanguage.value;
  if (lang === 'zh') return zhCN;
  if (lang === 'jp') return jaJP;
  return enUS;
});

// 2. 状态管理
const currentPostId = ref(null); // 控制当前查看的文章 ID

// 3. 使用 API
// 当 currentPostId 改变时，useBlogPosts 内部会根据传入的 ID 重新抓取数据
const { posts, post, loading, error, refresh } = useBlogPosts(currentPostId);

// 计算属性：是否有列表数据
const hasPosts = computed(() => posts.value && posts.value.length > 0);

// 4. 交互方法
const selectPost = (id) => {
  currentPostId.value = id;
  window.scrollTo(0, 0); // 切换文章后滚动到顶部
};

const backToList = () => {
  currentPostId.value = null;
};
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
.loading-section,
.error-section,
.empty-section {
  border-bottom: 1px solid var(--border-color);
}

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

/* 博客列表 */
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

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0;
}

.post-card {
  padding: var(--pad-lg);
  border: 1px solid var(--border-color);
  outline: 1px solid var(--border-color);
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  gap: var(--pad-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-card:hover {
  background: var(--bg);
}

.post-card:hover .post-title {
  color: var(--accent);
}

.post-card:hover .read-more {
  color: var(--accent);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--pad-xs);
}

.post-number {
  font-size: 10px;
  color: var(--accent);
  font-weight: bold;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-date {
  font-size: 10px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: var(--pad-xs);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-sub);
  margin-bottom: var(--pad-sm);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--pad-sm);
}

.post-tag {
  font-size: 10px;
  color: var(--text-sub);
  padding: 2px 6px;
  border: 1px solid var(--border-color);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-footer {
  margin-top: auto;
  padding-top: var(--pad-sm);
  border-top: 1px solid var(--border-color);
}

.read-more {
  font-size: 12px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  transition: color 0.2s ease;
}

/* 博客详情页 */
.blog-detail {
  padding: var(--pad-lg);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--pad-lg);
  padding-bottom: var(--pad-md);
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--accent);
  font-size: 14px;
  cursor: pointer;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  padding: var(--pad-xs) var(--pad-sm);
  border: 1px solid var(--border-color);
}

.back-btn:hover {
  background: var(--bg);
}

.detail-meta {
  display: flex;
  gap: var(--pad-md);
  font-size: 12px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
}

.post-title-large {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: var(--pad-md);
  line-height: 1.1;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-tags-large {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pad-xs);
  margin-bottom: var(--pad-lg);
}

.post-tag-large {
  font-size: 12px;
  color: var(--accent);
  padding: 4px 8px;
  border: 1px solid var(--accent);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

/* Markdown内容样式 */
.post-body {
  line-height: 1.8;
  color: var(--text-main);
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  margin: var(--pad-lg) 0 var(--pad-md) 0;
  font-weight: 800;
}

.post-body :deep(h1) {
  font-size: 32px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--pad-sm);
}

.post-body :deep(h2) {
  font-size: 24px;
}

.post-body :deep(h3) {
  font-size: 20px;
}

.post-body :deep(p) {
  margin-bottom: var(--pad-md);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin-bottom: var(--pad-md);
  padding-left: var(--pad-md);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-body :deep(li) {
  margin-bottom: 4px;
}

.post-body :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding-left: var(--pad-sm);
  margin: var(--pad-md) 0;
  color: var(--text-sub);
  font-style: italic;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.post-body :deep(code) {
  background: var(--bg);
  padding: 2px 4px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.post-body :deep(pre) {
  background: var(--bg);
  border: 1px solid var(--border-color);
  padding: var(--pad-sm);
  margin: var(--pad-sm) 0;
  overflow-x: auto;
}

.post-body :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
}

.post-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
}

.post-body :deep(a:hover) {
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .massive-title {
    font-size: 80px;
  }
  
  .post-title-large {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .massive-title {
    font-size: 60px;
  }
  
  .post-title-large {
    font-size: 28px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--pad-sm);
  }
  
  .detail-meta {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .massive-title {
    font-size: 40px;
  }
  
  .post-title-large {
    font-size: 24px;
  }
  
  .post-title {
    font-size: 18px;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>