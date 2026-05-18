<template>
  <main>
    <section class="blog-detail">
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
import { toRef } from 'vue';
import { useRouter } from 'vue-router';
import { useLocaleContent } from '../locales';
import { useBlogPosts } from '../api/blogs.js';

const props = defineProps({
  id: { type: String, required: true }
});

const router = useRouter();

const { content } = useLocaleContent();

const postIdRef = toRef(props, 'id');
const { post, loading } = useBlogPosts(postIdRef);

const backToList = () => {
  router.push({ name: 'blog' });
};
</script>

<style scoped>
.blog-detail {
  padding: var(--pad-lg);
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
  font-family: var(--font-family-heading);
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
  font-family: var(--font-family-heading);
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
  font-family: var(--font-family-heading);
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
  font-family: var(--font-family-heading);
}

.post-body {
  line-height: 1.8;
  color: var(--text-main);
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
  font-family: var(--font-family-heading);
  margin: var(--pad-lg) 0 var(--pad-md) 0;
  font-weight: 800;
}

.post-body :deep(h1) {
  font-size: 32px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--pad-sm);
}

.post-body :deep(h2) { font-size: 24px; }
.post-body :deep(h3) { font-size: 20px; }

.post-body :deep(p) {
  margin-bottom: var(--pad-md);
  font-family: var(--font-family-heading);
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin-bottom: var(--pad-md);
  padding-left: var(--pad-md);
  font-family: var(--font-family-heading);
}

.post-body :deep(li) { margin-bottom: 4px; }

.post-body :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding-left: var(--pad-sm);
  margin: var(--pad-md) 0;
  color: var(--text-sub);
  font-style: italic;
  font-family: var(--font-family-heading);
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

.post-body :deep(a:hover) { opacity: 0.7; }

.post-body :deep(.math-inline) {
  display: inline-block;
  margin: 0 2px;
}

.post-body :deep(.math-block) {
  text-align: center;
  margin: var(--pad-md) 0;
  padding: var(--pad-sm);
  overflow-x: auto;
}

@media (max-width: 1024px) {
  .post-title-large { font-size: 36px; }
}

@media (max-width: 768px) {
  .post-title-large { font-size: 28px; }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--pad-sm);
  }

  .detail-meta { align-self: flex-end; }
}

@media (max-width: 480px) {
  .post-title-large { font-size: 24px; }
}
</style>