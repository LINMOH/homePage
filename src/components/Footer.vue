<template>
  <footer class="footer">
    <span>{{ content.footer.location }}</span>
    <span class="accent-text">{{ content.footer.established }}</span>
  </footer>
</template>

<script setup>
import { content } from '../data/content.js';
</script>

<style scoped>
.footer {
  padding: var(--pad-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-sub);
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}

.accent-text {
  color: var(--accent);
  font-weight: 700;
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
}
</style>
