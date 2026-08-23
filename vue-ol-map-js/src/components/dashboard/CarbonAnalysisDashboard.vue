<template>
  <CarbonAnalysisPanel
    v-model:year="selectedYear"
    v-model:start-year="selectedStartYear"
    v-model:end-year="selectedEndYear"
    v-model:metric="selectedMetric"
    v-model:top-n="selectedTopN"
    v-model:mode="selectedMode"
    v-model:selected-cities="selectedCities"
    :all-cities-list="allCitiesList"
  >
    <div class="analysis-grid">
      <div class="grid-cell">
        <CarbonRankingChart
          :data="chartData"
          :metric="selectedMetric"
          :top-n="selectedTopN"
          :mode="selectedMode"
          @city-click="onChartCityClick"
        />
      </div>
      <div class="grid-cell">
        <CarbonEfficiencyChart :data="chartData" @city-click="onChartCityClick" />
      </div>
      <div class="grid-cell">
        <CarbonGrowthChart
          :start-data="growthStartData"
          :end-data="growthEndData"
          :metric="selectedMetric"
          :top-n="selectedTopN"
          :mode="selectedMode"
          @city-click="onChartCityClick"
        />
      </div>
      <div class="grid-cell">
        <CarbonTrendChart
          :all-years-data="allYearsData"
          :cities="selectedCities"
          :metric="selectedMetric"
        />
      </div>
    </div>
  </CarbonAnalysisPanel>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CarbonAnalysisPanel from '../panels/CarbonAnalysisPanel.vue'
import CarbonRankingChart from '../charts/CarbonRankingChart.vue'
import CarbonEfficiencyChart from '../charts/CarbonEfficiencyChart.vue'
import CarbonGrowthChart from '../charts/CarbonGrowthChart.vue'
import CarbonTrendChart from '../charts/CarbonTrendChart.vue'
import { loadCo2Data, getYears } from '../../services/co2DataService'
import { useSharedStore } from '../../shared/stores/sharedStore'

const ALL_YEARS = getYears()
const sharedStore = useSharedStore()

const selectedYear = ref('2020')
const selectedStartYear = ref('2005')
const selectedEndYear = ref('2020')
const selectedMetric = ref('totalEmission')
const selectedTopN = ref(10)
const selectedMode = ref('top')
const selectedCities = ref([])
const chartData = ref([])
const growthStartData = ref([])
const growthEndData = ref([])
const allYearsData = ref({})

const allCitiesList = computed(() => {
  const firstYearData = allYearsData.value[ALL_YEARS[0]]
  if (!firstYearData) return []
  return firstYearData
    .map(item => item['城市名称'])
    .filter(Boolean)
    .sort()
})

const DEFAULT_TREND_CITIES = ['北京', '上海', '广州', '深圳', '武汉']

function initDefaultCities(list) {
  if (!selectedCities.value.length) {
    const available = DEFAULT_TREND_CITIES.filter(c => list.includes(c))
    selectedCities.value = available.length ? available : list.slice(0, 5)
  }
}

const loadAllYearsData = async () => {
  try {
    const results = await Promise.all(
      ALL_YEARS.map(year => loadCo2Data(year))
    )
    const data = {}
    ALL_YEARS.forEach((year, i) => {
      data[year] = results[i]
    })
    allYearsData.value = data
  } catch (error) {
    console.error('加载全年度数据失败:', error)
  }
}

const loadRankingData = async () => {
  try {
    chartData.value = await loadCo2Data(selectedYear.value)
  } catch (error) {
    console.error('加载碳排放数据失败:', error)
  }
}

const loadGrowthData = async () => {
  try {
    const [startData, endData] = await Promise.all([
      loadCo2Data(selectedStartYear.value),
      loadCo2Data(selectedEndYear.value)
    ])
    growthStartData.value = startData
    growthEndData.value = endData
  } catch (error) {
    console.error('加载增长率数据失败:', error)
  }
}

onMounted(async () => {
  await loadAllYearsData()
  loadRankingData()
  loadGrowthData()
  initDefaultCities(allCitiesList.value)
})

watch(selectedYear, () => {
  loadRankingData()
})

const MAX_TREND_CITIES = 5

function onChartCityClick(cityName) {
  selectedCities.value = []
  const current = [...sharedStore.selectedCitiesForTrend]
  const idx = current.indexOf(cityName)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(cityName)
    if (current.length > MAX_TREND_CITIES) {
      current.shift()
    }
  }
  sharedStore.setSelectedCitiesForTrend(current)
}

watch(selectedCities, (cities) => {
  if (cities.length) {
    sharedStore.setSelectedCitiesForTrend([])
  }
})

watch([selectedStartYear, selectedEndYear], () => {
  loadGrowthData()
})
</script>

<style scoped>
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  height: 100%;
}

.grid-cell {
  min-height: 0;
  background: rgba(17, 47, 83, 0.4);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 4px;
  padding: 12px;
}
</style>