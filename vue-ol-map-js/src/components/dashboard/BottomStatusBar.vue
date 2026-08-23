<template>
  <div class="bottom-status-bar">
    <div class="status-spacer"></div>
    <div class="status-item">
      <span class="status-label">缩放级别</span>
      <span class="status-value">{{ store.zoom }}</span>
    </div>
    <div class="status-divider"></div>
    <div class="status-item">
      <span class="status-label">比例尺</span>
      <span class="status-value">{{ store.scale }}</span>
    </div>
    <div class="status-divider"></div>
    <div class="status-item">
      <span class="status-label">经度</span>
      <span class="status-value">{{ store.longitude }}</span>
    </div>
    <div class="status-divider"></div>
    <div class="status-item">
      <span class="status-label">纬度</span>
      <span class="status-value">{{ store.latitude }}</span>
    </div>
  </div>
</template>

<script setup>
import { useSharedStore } from '../../shared/stores/sharedStore'

const store = useSharedStore()
</script>

<style scoped>
.bottom-status-bar {
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: rgba(17, 47, 83, 0.92);
  border-top: 1px solid rgba(0, 229, 255, 0.25);
  flex-shrink: 0;
  gap: 6px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-label {
  font-size: 11px;
  color: rgba(180, 220, 255, 0.6);
}

.status-value {
  font-size: 11px;
  color: #00e5ff;
  font-family: 'Courier New', monospace;
  min-width: 48px;
}

.status-divider {
  width: 1px;
  height: 14px;
  background: rgba(0, 229, 255, 0.2);
  margin: 0 8px;
}

.status-spacer {
  flex: 1;
}
</style>