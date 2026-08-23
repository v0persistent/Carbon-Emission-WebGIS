<template>
  <div class="map-page">
    <div class="map-main">
      <ControlPanel />
      <BasemapSwitch />
      <button class="reset-view-btn" title="复位视图" @click="handleResetView">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
      <div class="map-center">
        <MapView ref="mapViewRef" />
      </div>
      <Co2Comparison />
    </div>
    <BottomStatusBar />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapView from '../components/map/MapView.vue'
import Co2Comparison from '../components/dashboard/Co2Comparison.vue'
import ControlPanel from '../components/panels/ControlPanel.vue'
import BasemapSwitch from '../components/panels/BasemapSwitch.vue'
import BottomStatusBar from '../components/dashboard/BottomStatusBar.vue'

const mapViewRef = ref(null)

function handleResetView() {
  mapViewRef.value?.resetView()
}
</script>

<style scoped>
.map-page {
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.map-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.map-center {
  flex: 1;
  position: relative;
  min-width: 0;
}

.reset-view-btn {
  position: fixed;
  top: 56px;
  left: 296px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 47, 83, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
  color: rgba(180, 220, 255, 0.9);
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(5px);
  padding: 0;
}

.reset-view-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00e5ff;
  color: #00e5ff;
}
</style>