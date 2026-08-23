<template>
  <div id="map"></div>
</template>

<script setup>
// @switch-basemap="layerControl.switchBasemap"
import { onMounted, ref, watch } from 'vue'
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css'
import {
  chinaExtent4326,
  examplePoint,
  initialCenter,
  initialZoom,
  wfsBoundaryConfig
} from '../../config/mapConfig'
import { createMap } from '../../map/core/createMap'
import { useBasemapSwitcher } from '../../map/composables/useBasemapSwitcher'
import { createBoundaryWmsLayer, createBoundaryWfsLayer } from '../../map/layers/boundaryLayer'
import { createGeojsonLayer, createBusStopVtLayer } from '../../map/layers/geojsonLayer'
import { createEmissionWmsLayer } from '../../map/layers/emissionWmsLayer'
import { setupMapInteractions } from '../../map/interactions/mapInteractions'
import { useMapChartOrchestrator } from '../../orchestrators/mapChartOrchestrator'
import { useLayerControl } from '../../map/composables/useLayerControl'
import { useMapSelection } from '../../map/composables/useMapSelection'
import { useBoundaryLayer } from '../../map/composables/useBoundaryLayer'
import { useSharedStore } from '../../shared/stores/sharedStore'
import { emissionStyleMap, yearSuffixMap } from '../../config/mapConfig'
import { getBoundaryHoverStyle } from '../../map/styles/vectorStyles'

const orchestrator = useMapChartOrchestrator()
const store = useSharedStore()

const mapRef = ref(null)

const { basemapLayer } = useBasemapSwitcher()

const { layer: geojsonLayer, source: geojsonSource, format: geojsonFormat } = createGeojsonLayer()
const { layer: busStopVtLayer } = createBusStopVtLayer()
const { layer: boundaryWmsLayer, source: boundaryWmsSource } = createBoundaryWmsLayer()
const { layer: boundaryWfsLayer, source: boundaryWfsSource, format: boundaryWfsFormat } = createBoundaryWfsLayer()

const emissionWms = createEmissionWmsLayer()

const layerControl = useLayerControl({ geojsonLayer, geojsonSource, geojsonFormat })
const selection = useMapSelection({ geojsonSource, boundaryWmsSource })
const boundary = useBoundaryLayer({ boundaryWfsSource, boundaryWfsFormat, boundaryWmsLayer, boundaryWfsLayer })

function resetView() {
  const map = mapRef.value
  if (!map) return

  map.getView().animate({
    center: fromLonLat(initialCenter),
    zoom: initialZoom,
    duration: 700
  })
}

function zoomToExamplePoint() {
  const map = mapRef.value
  if (!map) return

  map.getView().animate({
    center: fromLonLat(examplePoint.center),
    zoom: examplePoint.zoom,
    duration: 700
  })
}

function zoomToGeojson() {
  layerControl.fitGeojson(mapRef.value)
}

function handleSwitchDataSource(type) {
  layerControl.switchDataSource(type, {
    map: mapRef.value,
    clearSelection: selection.clearSelectedFeature
  })
}

function handleRefreshGeojson() {
  layerControl.refreshGeojson({
    map: mapRef.value,
    clearSelection: selection.clearSelectedFeature
  })
}

function handleTargetChange(name) {
  const map = mapRef.value
  if (!map) return

  const normalizedName = boundary.normalizeCityName(name)

  const foundInBoundary = boundary.highlightBoundaryByName(map, name)
  if (foundInBoundary) {
    orchestrator.onMapFeatureSelected({ name })
    return
  }

  const matchedFeature = geojsonSource
    .getFeatures()
    .find((feature) => {
      const featureName = boundary.normalizeCityName(selection.getFeatureName(feature))
      return featureName.includes(normalizedName) || normalizedName.includes(featureName)
    })

  if (matchedFeature) {
    selection.selectFeature(matchedFeature)
    selection.zoomToFeature(map, matchedFeature)
    orchestrator.onMapFeatureSelected({ name })
  }
}

watch(() => orchestrator.store.comparisonTarget, (newTarget) => {
  if (newTarget) {
    handleTargetChange(newTarget)
  }
})

watch([() => store.emissionIndicator, () => store.emissionDetailIndicator, () => store.selectedYear],
  ([indicator, detail, year]) => {
    if (!indicator || !year) {
      emissionWms.layer.setVisible(false)
      return
    }

    const lookupKey = detail || indicator
    const baseName = emissionStyleMap[lookupKey]

    if (!baseName) {
      emissionWms.layer.setVisible(false)
      return
    }

    const styleName = baseName + '_' + yearSuffixMap[year]
    emissionWms.source.updateParams({ STYLES: styleName })
    emissionWms.layer.setVisible(true)
  }
)

function formatScale(denominator) {
  if (denominator >= 1000000) {
    return '1:' + (denominator / 10000).toFixed(0) + '万'
  }
  return '1:' + Math.round(denominator).toLocaleString()
}

onMounted(() => {
  const map = createMap({
    target: 'map',
    center: initialCenter,
    zoom: initialZoom,
    minZoom: 4,
    maxZoom: 18,
    extent4326: chinaExtent4326
  })

  mapRef.value = map

  store.setZoom(map.getView().getZoom())
  store.setScale(formatScale(map.getView().getResolution() * 96 * 39.37))

  map.getView().on('change:resolution', () => {
    const zoom = Math.round(map.getView().getZoom() * 10) / 10
    store.setZoom(zoom)

    const resolution = map.getView().getResolution()
    const dpi = 96
    const inchesPerMeter = 39.37
    const scaleDenominator = resolution * dpi * inchesPerMeter
    store.setScale(formatScale(scaleDenominator))
  })

  map.addLayer(basemapLayer)
  // map.addLayer(busStopVtLayer)
  map.addLayer(geojsonLayer)
  // map.addLayer(boundaryWmsLayer)
  map.addLayer(boundaryWfsLayer)
  map.addLayer(emissionWms.layer)

  boundary.loadBoundaryWfsData()

  let hoveredBoundaryFeature = null

  map.on('pointermove', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => {
      if (f.get('source') === 'boundaryWfs') return f
      return null
    })

    if (hoveredBoundaryFeature && hoveredBoundaryFeature !== feature) {
      if (hoveredBoundaryFeature !== boundary.highlightedBoundaryFeature.value) {
        hoveredBoundaryFeature.setStyle(undefined)
      }
      hoveredBoundaryFeature = null
    }

    if (feature && feature !== hoveredBoundaryFeature) {
      if (feature !== boundary.highlightedBoundaryFeature.value) {
        feature.setStyle(getBoundaryHoverStyle)
      }
      hoveredBoundaryFeature = feature
      map.getTargetElement().style.cursor = 'pointer'
    } else if (!feature) {
      map.getTargetElement().style.cursor = ''
    }
  })

  setupMapInteractions(map, {
    onFeatureClick(feature) {
      const source = feature.get('source')
      if (source === 'boundaryWfs') {
        const cityName = feature.get(wfsBoundaryConfig.attributeNames.cityName)
        if (cityName) {
          boundary.highlightBoundaryByName(map, cityName)
          orchestrator.onMapFeatureSelected({ name: cityName })
          return
        }
      }

      selection.selectFeature(feature)
    },
    onNoFeatureClick(evt) {
      selection.getWmsFeatureInfo(map, evt, {
        onCityFound(cityName) {
          boundary.highlightBoundaryByName(map, cityName)
          orchestrator.onMapFeatureSelected({ name: cityName })
        }
      })
    },
    onPointerMove({ lon, lat }) {
      store.setCoordinates(lon.toFixed(5), lat.toFixed(5))
    }
  })
})

defineExpose({ resetView })
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
