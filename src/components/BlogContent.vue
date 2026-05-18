<template>
  <main>
    <section class="hero">
      <h1 class="massive-title">{{ content.blog.title }}</h1>
      <p class="subtitle">Personal Thoughts & Technical Notes</p>
    </section>

    <section class="blog-list">
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
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocaleContent } from '../locales';
import { useBlogPosts } from '../api/blogs.js';

const router = useRouter();

const { content } = useLocaleContent();

const { posts, loading, refresh } = useBlogPosts();

const hasPosts = computed(() => posts.value && posts.value.length > 0);

const selectPost = (id) => {
  router.push({ name: 'blog-detail', params: { id } });
};
</script>

<style scoped>
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
  font-family: var(--font-family-heading);
}

.subtitle {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--text-sub);
  font-family: var(--font-family-heading);
}

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
  to { transform: rotate(360deg); }
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
  font-family: var(--font-family-heading);
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
  font-family: var(--font-family-heading);
}

.post-date {
  font-size: 10px;
  color: var(--text-sub);
  font-family: var(--font-family-heading);
}

.post-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: var(--pad-xs);
  font-family: var(--font-family-heading);
}

.post-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-sub);
  margin-bottom: var(--pad-sm);
  font-family: var(--font-family-heading);
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
  font-family: var(--font-family-heading);
}

.post-footer {
  margin-top: auto;
  padding-top: var(--pad-sm);
  border-top: 1px solid var(--border-color);
}

.read-more {
  font-size: 12px;
  color: var(--text-sub);
  font-family: var(--font-family-heading);
  transition: color 0.2s ease;
}

@media (max-width: 1024px) {
  .massive-title { font-size: 80px; }
}

@media (max-width: 768px) {
  .massive-title { font-size: 60px; }
  .post-title { font-size: 18px; }
}

@media (max-width: 480px) {
  .massive-title { font-size: 40px; }
  .posts-grid { grid-template-columns: 1fr; }
}
</style>