import { useSharedStore } from '../shared/stores/sharedStore'

export function useMapChartOrchestrator() {
  const store = useSharedStore()

  function onMapFeatureSelected({ name, featureId, type }) {
    store.setRegion(name)
    if (featureId !== undefined) {
      store.setFeatureId(featureId)
    }
  }

  function onChartTargetChange({ name, type }) {
    store.setComparisonTarget(name)
  }

  function onYearChange(year) {
    store.setYear(year)
  }

  function onMapCleared() {
    store.setRegion('')
    store.setFeatureId(null)
  }

  function onComparisonCleared() {
    store.setComparisonTarget('')
  }

  return {
    store,
    onMapFeatureSelected,
    onChartTargetChange,
    onYearChange,
    onMapCleared,
    onComparisonCleared
  }
}
