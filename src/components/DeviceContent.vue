<template>
  <section id="device" class="section">
    <div class="section-header">
      <h2 class="section-title">{{ content.device.title }}</h2>
    </div>
    
    <!-- 设备概览 - 蓝图风格 -->
    <div class="device-overview">
      <div class="blueprint-grid">
        <!-- 计算机系统 -->
        <div class="blueprint-card">
          <div class="blueprint-header">
            <div class="blueprint-number">01</div>
            <h3 class="blueprint-title">{{ content.device.computer.title }}</h3>
          </div>
          <div class="blueprint-content">
            <div class="spec-grid">
              <div v-for="(spec, index) in content.device.computer.specs" :key="index" class="spec-item">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 外设系统 -->
        <div class="blueprint-card">
          <div class="blueprint-header">
            <div class="blueprint-number">02</div>
            <h3 class="blueprint-title">{{ content.device.peripherals.title }}</h3>
          </div>
          <div class="blueprint-content">
            <div class="spec-grid">
              <div v-for="(spec, index) in content.device.peripherals.specs" :key="index" class="spec-item">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 软件环境 -->
        <div class="blueprint-card">
          <div class="blueprint-header">
            <div class="blueprint-number">03</div>
            <h3 class="blueprint-title">{{ content.device.software.title }}</h3>
          </div>
          <div class="blueprint-content">
            <div class="spec-grid">
              <div v-for="(spec, index) in content.device.software.specs" :key="index" class="spec-item">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作系统 -->
        <div class="blueprint-card">
          <div class="blueprint-header">
            <div class="blueprint-number">04</div>
            <h3 class="blueprint-title">{{ content.device.os.title }}</h3>
          </div>
          <div class="blueprint-content">
            <div class="spec-grid">
              <div v-for="(spec, index) in content.device.os.specs" :key="index" class="spec-item">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { currentLanguage } from '../locales';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';
import jaJP from '../locales/ja-JP.js';

// 根据当前语言获取内容
const content = computed(() => {
  const lang = currentLanguage.value;
  if (lang === 'zh') return zhCN;
  if (lang === 'jp') return jaJP;
  return enUS;
});
</script>

<style scoped>
.device-overview {
  width: 100%;
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  /* 整体大外框 */
  border-left: 1px solid var(--border-color);
  border-top: 1px solid var(--border-color);
}

.blueprint-card {
  padding: 0;
  background: var(--bg);
  /* 内部格线：通过右边框和下边框实现网格线，避免重复 */
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.blueprint-header {
  display: flex;
  align-items: center;
  gap: var(--pad-sm);
  padding: var(--pad-lg);
  /* 标题下方横线 */
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg);
}

.blueprint-number {
  font-size: var(--font-size-xs);
  color: var(--accent);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  min-width: 24px;
}

.blueprint-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  letter-spacing: -0.5px;
}

.blueprint-content {
  flex: 1;
  width: 100%;
}

/* --- 核心修改：顶格规格表 --- */
.spec-grid {
  display: flex;
  flex-direction: column;
  margin: 0; /* 彻底移除外边距，实现顶格 */
  border: none; /* 移除自带边框，直接贴合 card 边框 */
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 增加内部左右间距，确保文字不紧贴物理边框 */
  padding: var(--pad-md) var(--pad-lg); 
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.spec-item:last-child {
  border-bottom: none; /* 最后一行不需要底线，因为它会和 card 的底线重合 */
}

.spec-item:hover {
  background-color: rgba(var(--accent-rgb), 0.03); /* 可选：悬停高亮 */
}

.spec-label {
  font-size: var(--font-size-sm);
  color: var(--text-sub);
  font-family: var(--font-family-heading);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-main);
  font-family: var(--font-family-heading);
  text-align: right;
  max-width: 70%;
  word-break: break-word;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .blueprint-header {
    padding: var(--pad-md);
  }
  
  .spec-item {
    padding: var(--pad-md);
  }

  .blueprint-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .blueprint-header {
    padding: var(--pad-sm) var(--pad-md);
    gap: 4px;
  }
  
  .spec-item {
    padding: var(--pad-sm) var(--pad-md);
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .spec-label,
  .spec-value {
    width: 100%;
    text-align: left;
    max-width: 100%;
  }
}
</style>