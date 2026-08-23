<template>
  <div class="basemap-switch">
    <button
      v-for="item in basemapItems"
      :key="item.key"
      :class="['btn', { active: currentBasemap === item.key }]"
      @click="switchBasemap(item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { basemapList } from '../../config/mapConfig'
import { useBasemapSwitcher } from '../../map/composables/useBasemapSwitcher'

const { currentBasemap, switchBasemap } = useBasemapSwitcher()

const basemapItems = computed(() =>
  basemapList.filter((item) => item.key !== 'hybrid')
)
</script>

<style scoped>
.basemap-switch {
  position: fixed;
  bottom: 36px;
  left: 8px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  z-index: 100;
}

.btn {
  padding: 6px 16px;
  background: rgba(17, 47, 83, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(5px);
  white-space: nowrap;
}

.btn:hover {
  background: rgba(0, 229, 255, 0.18);
  border-color: #00e5ff;
  color: #00e5ff;
}

.btn.active {
  background: rgba(0, 229, 255, 0.22);
  border-color: #00e5ff;
  color: #00e5ff;
}
</style>