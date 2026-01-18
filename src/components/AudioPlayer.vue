<template>
  <audio ref="audioPlayer" loop>
    <source src="../assets/shionari.mp3" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const audioPlayer = ref(null);

const playAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = 0.1;
    audioPlayer.value.play().catch(error => {
      console.log('播放失败:', error);
    });
    // 播放后立即移除所有事件监听器
    document.removeEventListener('click', playAudio);
    document.removeEventListener('scroll', playAudio);
  }
};

onMounted(() => {
  // 监听用户的第一次交互（点击或滚动）
  document.addEventListener('click', playAudio, { once: true });
  document.addEventListener('scroll', playAudio, { once: true });
});

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  document.removeEventListener('click', playAudio);
  document.removeEventListener('scroll', playAudio);
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
