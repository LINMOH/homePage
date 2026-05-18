<template>
  <main>
    <section class="hero">
      <h1 class="massive-title">404</h1>
      <p class="subtitle">Page Not Found</p>
    </section>
    <section class="not-found-section">
      <p class="not-found-text">The page you are looking for does not exist.</p>
      <router-link to="/" class="home-link">← Return Home</router-link>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
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

.not-found-section {
  padding: var(--pad-lg);
}

.not-found-text {
  font-size: 16px;
  color: var(--text-sub);
  margin-bottom: var(--pad-md);
  font-family: var(--font-family-heading);
}

.home-link {
  display: inline-block;
  padding: var(--pad-sm) var(--pad-md);
  border: 1px solid var(--border-color);
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-family-heading);
  font-size: 14px;
}

.home-link:hover {
  background: var(--bg);
}

@media (max-width: 1024px) {
  .massive-title { font-size: 80px; }
}

@media (max-width: 768px) {
  .massive-title { font-size: 60px; }
}

@media (max-width: 480px) {
  .massive-title { font-size: 40px; }
}
</style>