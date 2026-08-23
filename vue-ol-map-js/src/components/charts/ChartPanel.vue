<template>
  <div class="chart-panel">
    <div v-if="title" class="chart-panel-title">{{ title }}</div>
    <div v-if="loading" class="chart-panel-loading">加载中...</div>
    <div v-else class="chart-panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.chart-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.chart-panel-title {
  font-size: 18px;
  letter-spacing: 1px;
  color: rgba(180, 220, 255, 0.7);
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  padding-bottom: 3px;
}

.chart-panel-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(180, 220, 255, 0.5);
  font-size: 12px;
}

.chart-panel-body {
  flex: 1;
  min-height: 0;
}
</style>
