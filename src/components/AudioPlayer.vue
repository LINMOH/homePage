<template>
  <audio ref="audioPlayer" loop>
    <source src="../assets/shionari.mp3" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const audioPlayer = ref(null);

onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = 0.1;
    audioPlayer.value.play().catch(error => {
      console.log('自动播放被阻止，需要用户交互:', error);
    });
  }
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
