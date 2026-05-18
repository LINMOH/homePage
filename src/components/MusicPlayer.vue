<template>
  <div class="music-player">
    <button class="music-toggle" @click="toggleMusic" :title="isPlaying ? 'Pause' : 'Play'">
      <i v-if="isPlaying" class="fa-solid fa-volume-high"></i>
      <i v-else class="fa-solid fa-volume-xmark"></i>
    </button>
    <audio ref="audioPlayer" loop>
      <source src="../assets/shionari.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const audioPlayer = ref(null);
const isPlaying = ref(false);
let hasInteracted = false;

const playAudio = () => {
  if (!hasInteracted && audioPlayer.value) {
    hasInteracted = true;
    audioPlayer.value.volume = 0.1;
    audioPlayer.value.play().then(() => {
      isPlaying.value = true;
    }).catch(error => {
      console.log('Playback failed:', error);
      hasInteracted = false;
    });
    document.removeEventListener('click', playAudio, true);
    document.removeEventListener('touchstart', playAudio, true);
    document.removeEventListener('keydown', playAudio, true);
  }
};

const toggleMusic = () => {
  if (!audioPlayer.value) return;

  if (!hasInteracted) {
    hasInteracted = true;
    audioPlayer.value.volume = 0.1;
  }

  if (isPlaying.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
  } else {
    audioPlayer.value.play().then(() => {
      isPlaying.value = true;
    }).catch(() => {
      isPlaying.value = false;
    });
    document.removeEventListener('click', playAudio, true);
    document.removeEventListener('touchstart', playAudio, true);
    document.removeEventListener('keydown', playAudio, true);
  }
};

onMounted(() => {
  document.addEventListener('click', playAudio, { capture: true, passive: true });
  document.addEventListener('touchstart', playAudio, { capture: true, passive: true });
  document.addEventListener('keydown', playAudio, { capture: true, passive: true });
});

onUnmounted(() => {
  document.removeEventListener('click', playAudio, true);
  document.removeEventListener('touchstart', playAudio, true);
  document.removeEventListener('keydown', playAudio, true);
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: var(--pad-md);
  right: var(--pad-md);
  z-index: 1000;
}

.music-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.music-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}

audio {
  display: none;
}
</style>