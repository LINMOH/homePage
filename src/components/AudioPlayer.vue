<template>
  <audio ref="audioPlayer" loop>
    <source src="../assets/shionari.mp3" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const audioPlayer = ref(null);
let isPlaying = false;

const playAudio = () => {
  if (!isPlaying && audioPlayer.value) {
    isPlaying = true;
    audioPlayer.value.volume = 0.1;
    audioPlayer.value.play().then(() => {
      console.log('音频开始播放');
    }).catch(error => {
      console.log('播放失败:', error);
      isPlaying = false;
    });
    // 播放后立即移除所有事件监听器
    document.removeEventListener('click', playAudio, true);
    document.removeEventListener('touchstart', playAudio, true);
  }
};

onMounted(() => {
  // 只使用点击和触摸事件作为触发条件
  document.addEventListener('click', playAudio, { once: true, capture: true, passive: true });
  document.addEventListener('touchstart', playAudio, { once: true, capture: true, passive: true });
});

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  document.removeEventListener('click', playAudio, true);
  document.removeEventListener('touchstart', playAudio, true);
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
