<template>
  <transition name="slide-up" appear>
    <div class="category-group">
      <div class="category-header">
        <i :class="icon"></i>
        <h3 class="category-title">{{ title }}</h3>
      </div>
      <div class="category-cards">
        <transition-group name="fade" tag="div" class="cards-wrapper">
          <ResourceCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :follower-stats="followerStats"
            class="card-item"
          />
        </transition-group>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';
import ResourceCard from './ResourceCard.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  items: {
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
.category-group { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color var(--transition-base);
}

.category-header i {
  font-size: 1.1rem;
  color: var(--primary-color);
  transition: transform var(--transition-base);
}

.category-header:hover i {
  transform: scale(1.1);
}

.category-title {
  font-size: 1.4rem;
  font-weight: 600;
  font-family: 'Futura', sans-serif;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  transition: color var(--transition-base);
}

.category-cards { 
  display: grid; 
  grid-template-columns: repeat(2, minmax(0, 1fr)); 
  gap: 16px; 
  max-width: 100%; 
}

.cards-wrapper {
  display: contents;
}

/* 卡片进入动画 */
.card-item {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

.card-item:nth-child(1) { animation-delay: 0.1s; }
.card-item:nth-child(2) { animation-delay: 0.2s; }
.card-item:nth-child(3) { animation-delay: 0.3s; }
.card-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 */
.slide-up-enter-active {
  transition: all var(--transition-base);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-move {
  transition: transform var(--transition-base);
}

/* 平板适配 */
@media (max-width: 768px) {
  .category-cards {
    grid-template-columns: 1fr;
  }
}

/* 手机端适配 */
@media (max-width: 480px) {
  .category-header {
    padding-bottom: 8px;
  }

  .category-title {
    font-size: 1rem;
  }

  .category-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
