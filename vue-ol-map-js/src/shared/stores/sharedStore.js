import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const selectedRegion = ref('')
  const selectedYear = ref('2020')
  const selectedFeatureId = ref(null)
  const comparisonTarget = ref('')
  const longitude = ref('--')
  const latitude = ref('--')
  const zoom = ref(0)
  const scale = ref('--')
  const emissionIndicator = ref('')
  const emissionDetailIndicator = ref('')
  const activeEconTab = ref('')
  const selectedCitiesForTrend = ref([])

  const hasSelection = computed(() =>
    !!selectedRegion.value || !!selectedFeatureId.value || !!comparisonTarget.value
  )

  function clearSelection() {
    selectedRegion.value = ''
    selectedFeatureId.value = null
    comparisonTarget.value = ''
  }

  function setRegion(region) {
    selectedRegion.value = region
  }

  function setYear(year) {
    selectedYear.value = year
  }

  function setFeatureId(id) {
    selectedFeatureId.value = id
  }

  function setComparisonTarget(target) {
    comparisonTarget.value = target
  }

  function setCoordinates(lon, lat) {
    longitude.value = lon
    latitude.value = lat
  }

  function setZoom(level) {
    zoom.value = level
  }

  function setScale(value) {
    scale.value = value
  }

  function setEmissionIndicator(value) {
    emissionIndicator.value = value
  }

  function setEmissionDetail(value) {
    emissionDetailIndicator.value = value
  }

  function setActiveEconTab(value) {
    activeEconTab.value = value
  }

  function setSelectedCitiesForTrend(cities) {
    selectedCitiesForTrend.value = [...cities]
  }

  return {
    selectedRegion,
    selectedYear,
    selectedFeatureId,
    comparisonTarget,
    longitude,
    latitude,
    zoom,
    scale,
    hasSelection,
    emissionIndicator,
    emissionDetailIndicator,
    activeEconTab,
    selectedCitiesForTrend,
    clearSelection,
    setRegion,
    setYear,
    setFeatureId,
    setComparisonTarget,
    setCoordinates,
    setZoom,
    setScale,
    setEmissionIndicator,
    setEmissionDetail,
    setActiveEconTab,
    setSelectedCitiesForTrend
  }
})
