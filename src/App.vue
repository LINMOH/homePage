<template>
  <div class="radical-container">
    <TimeBar />

    <div class="main-wrapper">
      <Sidebar />

      <main class="content">
        <router-view />
      </main>
    </div>

    <Footer />

    <MusicPlayer />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { setLanguage, useLocaleContent } from './locales';
import TimeBar from './components/TimeBar.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';
import MusicPlayer from './components/MusicPlayer.vue';

const route = useRoute();
const { content } = useLocaleContent();

watch(() => route.path, () => {
  document.title = content.value.site?.title || 'Bcamy - Personal Homepage';
}, { immediate: true });

onMounted(() => {
  setLanguage('en');
});
</script>

<style scoped>
.radical-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.main-wrapper {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 40px);
}

.content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-wrapper {
    flex-direction: column;
  }
}
</style>