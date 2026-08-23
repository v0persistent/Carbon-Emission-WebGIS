import { ref } from 'vue'
import { getSelectedStyle } from '../styles/vectorStyles'
import { buildWmsFeatureInfoUrl, fetchWmsFeatureInfo } from '../services/wmsService'

export function useMapSelection({ geojsonSource, boundaryWmsSource }) {
  const selectedFeature = ref(null)
  const selectedProperties = ref(null)

  function clearSelectedFeature() {
    if (selectedFeature.value) {
      selectedFeature.value.setStyle(undefined)
    }

    selectedFeature.value = null
    selectedProperties.value = null
  }

  function selectFeature(feature) {
    if (selectedFeature.value) {
      selectedFeature.value.setStyle(undefined)
    }

    const properties = { ...feature.getProperties() }
    delete properties.geometry

    feature.setStyle(getSelectedStyle(feature))
    selectedFeature.value = feature
    selectedProperties.value = properties
  }

  function getFeatureName(feature) {
    return String(feature.get('地名') || '')
  }

  function zoomToFeature(map, feature) {
    const geometry = feature.getGeometry()
    if (!map || !geometry) return

    map.getView().fit(geometry.getExtent(), {
      padding: [40, 280, 40, 40],
      duration: 800,
      maxZoom: 15
    })
  }

  async function getWmsFeatureInfo(map, evt, { onCityFound }) {
    if (!map) return

    const view = map.getView()
    const resolution = view.getResolution()
    const projection = view.getProjection()
    const coordinate = map.getCoordinateFromPixel(evt.pixel)

    const url = buildWmsFeatureInfoUrl(boundaryWmsSource, coordinate, resolution, projection)
    if (!url) return

    try {
      const result = await fetchWmsFeatureInfo(url)

      if (result) {
        const { properties, cityName } = result
        if (cityName) {
          selectedProperties.value = properties
          onCityFound(cityName)
        }
      }
    } catch (error) {
      console.error('WMS GetFeatureInfo失败:', error)
    }
  }

  return {
    selectedFeature,
    selectedProperties,
    clearSelectedFeature,
    selectFeature,
    getFeatureName,
    zoomToFeature,
    getWmsFeatureInfo
  }
}
