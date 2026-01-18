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
    document.removeEventListener('click', playAudio);
    document.removeEventListener('scroll', playAudio);
    document.removeEventListener('keydown', playAudio);
    document.removeEventListener('touchstart', playAudio);
  }
};

onMounted(() => {
  // 监听用户的第一次交互（多种交互方式）
  document.addEventListener('click', playAudio, { once: true, passive: true });
  document.addEventListener('scroll', playAudio, { once: true, passive: true });
  document.addEventListener('keydown', playAudio, { once: true, passive: true });
  document.addEventListener('touchstart', playAudio, { once: true, passive: true });
});

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  document.removeEventListener('click', playAudio);
  document.removeEventListener('scroll', playAudio);
  document.removeEventListener('keydown', playAudio);
  document.removeEventListener('touchstart', playAudio);
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
