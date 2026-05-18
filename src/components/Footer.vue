<template>
  <footer class="footer">
    <span>{{ content.footer.location }}</span>
    <span class="copyright accent-text">© {{ content.footer.copyrightStartYear }}–{{ currentYear }} Lin Mohan</span>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useLocaleContent } from '../locales';

const { content } = useLocaleContent();

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  padding: var(--pad-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-sub);
  font-family: var(--font-family-heading);
}

.accent-text {
  color: var(--accent);
  font-weight: 700;
  font-family: var(--font-family-heading);
}

.copyright {
  color: var(--text-sub);
  font-weight: 400;
  font-family: var(--font-family-heading);
}
</style>
