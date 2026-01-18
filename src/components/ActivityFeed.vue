<template>
  <section class="activity-feed">
    <CategorySection
      v-for="category in categories"
      :key="category.name"
      :title="category.title"
      :icon="category.icon"
      :items="category.items"
      :follower-stats="followerStats"
    />
  </section>
</template>

<script setup>
import { defineProps } from 'vue';
import CategorySection from './CategorySection.vue';

defineProps({
  categories: {
    type: Array,
    required: true
  },
  followerStats: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
.activity-feed { 
  display: flex; 
  flex-direction: column; 
  gap: 40px; 
}
</style>
