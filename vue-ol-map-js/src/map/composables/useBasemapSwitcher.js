import { ref } from 'vue'
import { createBasemapLayer } from '../layers/basemapLayer'

// 模块级单例 —— 所有导入该 composable 的组件共享同一份状态
const basemap = createBasemapLayer('road')
const basemapLayer = basemap.layer
const currentBasemap = ref('road')

export function useBasemapSwitcher() {
  function switchBasemap(key) {
    basemap.switchTo(key)
    currentBasemap.value = key
  }

  return {
    basemapLayer,
    currentBasemap,
    switchBasemap
  }
}