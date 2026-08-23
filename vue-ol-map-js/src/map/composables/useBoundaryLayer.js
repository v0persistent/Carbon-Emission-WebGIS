import { ref } from 'vue'
import { getBoundaryHighlightStyle } from '../styles/vectorStyles'
import { fetchWfsBoundaryFeatures, findBoundaryFeatureByName } from '../services/wfsService'

export function useBoundaryLayer({ boundaryWfsSource, boundaryWfsFormat, boundaryWmsLayer, boundaryWfsLayer }) {
  const boundaryVisible = ref(true)
  const highlightedBoundaryFeature = ref(null)

  function normalizeCityName(name) {
    if (!name) return ''
    return name.trim()
      .replace(/市辖区$/, '')
      .replace(/市$/, '')
      .replace(/区$/, '')
      .replace(/县$/, '')
      .replace(/镇$/, '')
      .replace(/乡$/, '')
      .replace(/自治区$/, '')
      .replace(/自治州$/, '')
      .replace(/自治县$/, '')
      .trim()
  }

  async function loadBoundaryWfsData() {
    try {
      const features = await fetchWfsBoundaryFeatures(boundaryWfsFormat)
      boundaryWfsSource.addFeatures(features)
    } catch (error) {
      console.error('加载WFS行政区划数据失败:', error)
    }
  }

  function highlightBoundaryByName(map, cityName) {
    if (highlightedBoundaryFeature.value) {
      highlightedBoundaryFeature.value.setStyle(undefined)
      highlightedBoundaryFeature.value = null
    }

    const features = boundaryWfsSource.getFeatures()
    const matchedFeature = findBoundaryFeatureByName(features, cityName, normalizeCityName)

    if (matchedFeature) {
      matchedFeature.setStyle(getBoundaryHighlightStyle(matchedFeature))
      highlightedBoundaryFeature.value = matchedFeature

      const geometry = matchedFeature.getGeometry()
      if (geometry && map) {
        map.getView().fit(geometry.getExtent(), {
          padding: [150, 150, 150, 150],
          duration: 800,
          maxZoom: 14
        })
      }
      return true
    }
    return false
  }

  function toggleBoundaryLayer() {
    boundaryVisible.value = !boundaryVisible.value
    boundaryWmsLayer.setVisible(boundaryVisible.value)
    boundaryWfsLayer.setVisible(boundaryVisible.value)
  }

  return {
    boundaryVisible,
    highlightedBoundaryFeature,
    normalizeCityName,
    loadBoundaryWfsData,
    highlightBoundaryByName,
    toggleBoundaryLayer
  }
}
