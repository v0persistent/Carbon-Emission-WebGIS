import { ref } from 'vue'
import { fromLonLat } from 'ol/proj'
import { dataSourceMap } from '../../config/mapConfig'
import { loadVectorFeaturesBySource, replaceSourceFeatures } from '../services/geojsonService'

export function useLayerControl({ geojsonLayer, geojsonSource, geojsonFormat }) {
  const geojsonVisible = ref(true)
  const dataSourceType = ref('--')
  const geojsonStatus = ref('idle')
  const geojsonStatusText = ref('未加载')
  const allGeojsonFeatures = ref([])

  function toggleGeojson() {
    geojsonVisible.value = !geojsonVisible.value
    geojsonLayer.setVisible(geojsonVisible.value)
  }

  function fitGeojson(map) {
    const extent = geojsonSource.getExtent()
    if (!map || !extent || !isFinite(extent[0])) return

    map.getView().fit(extent, {
      padding: [40, 280, 40, 40],
      duration: 800,
      maxZoom: 14
    })
  }

  async function loadGeojsonBySource(type, { map, clearSelection }) {
    const dataSource = dataSourceMap[type]

    if (!dataSource) {
      geojsonStatus.value = 'error'
      geojsonStatusText.value = '加载失败（未知数据源）'
      return
    }

    if (dataSource.layerType !== 'vector') {
      geojsonStatus.value = 'error'
      geojsonStatusText.value = `加载失败（${dataSource.label} 不是矢量数据源）`
      return
    }

    geojsonStatus.value = 'loading'
    geojsonStatusText.value = '加载中...'

    try {
      const features = await loadVectorFeaturesBySource(dataSource, geojsonFormat)

      clearSelection()
      allGeojsonFeatures.value = [...features]
      replaceSourceFeatures(geojsonSource, features)

      geojsonStatus.value = 'success'
      geojsonStatusText.value = `加载成功（${features.length} 个要素）`
      fitGeojson(map)
    } catch (error) {
      clearSelection()
      allGeojsonFeatures.value = []
      geojsonSource.clear()
      geojsonStatus.value = 'error'
      geojsonStatusText.value = `加载失败（${error.message}）`
    }
  }

  function switchDataSource(type, options) {
    if (dataSourceType.value === type && geojsonStatus.value === 'loading') return

    dataSourceType.value = type
    loadGeojsonBySource(type, options)
  }

  function refreshGeojson(options) {
    if (!dataSourceType.value || dataSourceType.value === '--') return

    loadGeojsonBySource(dataSourceType.value, options)
  }

  return {
    geojsonVisible,
    dataSourceType,
    geojsonStatus,
    geojsonStatusText,
    allGeojsonFeatures,
    toggleGeojson,
    fitGeojson,
    loadGeojsonBySource,
    switchDataSource,
    refreshGeojson
  }
}
