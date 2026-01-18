<template>
  <audio ref="audioPlayer" loop>
    <source src="../assets/shionari.mp3" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const audioPlayer = ref(null);
let hasInteracted = false;

const playAudio = () => {
  if (!hasInteracted && audioPlayer.value) {
    hasInteracted = true;
    audioPlayer.value.volume = 0.1;
    audioPlayer.value.play().catch(error => {
      console.log('播放失败:', error);
    });
  }
};

onMounted(() => {
  // 监听点击和滚动事件
  document.addEventListener('click', playAudio);
  document.addEventListener('scroll', playAudio);
});

onUnmounted(() => {
  // 组件卸载时移除事件监听
  document.removeEventListener('click', playAudio);
  document.removeEventListener('scroll', playAudio);
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
