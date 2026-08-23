<template>
  <div v-if="selectedRegion && !isCollapsed" class="info-panel">
    <div class="panel-header">
      <div class="panel-title">地区信息</div>
      <button class="close-btn" @click="togglePanel">收起</button>
    </div>

    <div class="panel-content">
      <div class="info-section">
        <div class="info-row">
          <span class="info-label">地区名称</span>
          <span class="info-value">{{ selectedRegion || '--' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">所属省份</span>
          <span class="info-value">{{ province || '--' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">总碳排放量</span>
          <span class="info-value highlight">{{ totalEmission ? totalEmission + ' 万吨' : '--' }}</span>
        </div>
      </div>

      <div class="chart-section">
        <EmissionStructureChart
          :item="selectedTargetItem"
          :target-name="selectedRegion"
          :dimension="dimension"
        />
      </div>

      <div class="chart-section">
        <EmissionSourceChart
          :item="selectedTargetItem"
          :dimension="dimension"
        />
      </div>

      <div class="chart-section">
        <EmissionRegressionChart
          :data="chartData"
          :axis="regressionAxis"
          :selected-target="selectedRegion"
          :target-type="targetType"
        />
      </div>
    </div>
  </div>
  <button v-if="selectedRegion && isCollapsed" class="expand-btn" @click="togglePanel">展开信息</button>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useSharedStore } from '../../shared/stores/sharedStore'
import { loadCo2Data } from '../../services/co2DataService'
import EmissionStructureChart from '../charts/EmissionStructureChart.vue'
import EmissionSourceChart from '../charts/EmissionSourceChart.vue'
import EmissionRegressionChart from '../charts/EmissionRegressionChart.vue'

const store = useSharedStore()

const isCollapsed = ref(false)
const dimension = ref('industry')
const regressionAxis = ref('gdp-emission')
const targetType = ref('city')
const chartData = ref([])
const adminCode = ref('')
const province = ref('')
const totalEmission = ref('')
const selectedTargetItem = ref(null)

const selectedRegion = computed(() => store.selectedRegion)

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

async function loadCityData() {
  const region = selectedRegion.value
  const year = store.selectedYear

  if (!region || !year) {
    adminCode.value = ''
    province.value = ''
    totalEmission.value = ''
    selectedTargetItem.value = null
    chartData.value = []
    return
  }

  try {
    const data = await loadCo2Data(year)
    chartData.value = data

    const targetRegion = normalizeCityName(region)
    const cityItem = data.find(item => {
      const itemName = normalizeCityName(item['城市名称'])
      return itemName === targetRegion || itemName.includes(targetRegion) || targetRegion.includes(itemName)
    })

    if (cityItem) {
      adminCode.value = cityItem['行政编码'] || ''
      province.value = cityItem['省份'] || ''
      totalEmission.value = cityItem['总排放'] || ''
      selectedTargetItem.value = cityItem
    } else {
      adminCode.value = ''
      province.value = ''
      totalEmission.value = ''
      selectedTargetItem.value = null
    }
  } catch (error) {
    console.error('加载城市数据失败:', error)
  }
}

watch(selectedRegion, () => {
  isCollapsed.value = false
  loadCityData()
})

watch(() => store.selectedYear, () => {
  loadCityData()
})

const togglePanel = () => {
  isCollapsed.value = !isCollapsed.value
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })
}
</script>

<style scoped>
.info-panel {
  position: fixed;
  top: 56px;
  right: 8px;
  width: 360px;
  height: 740px;
  background: rgba(17, 47, 83, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
  z-index: 100;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  flex-shrink: 0;
}

.panel-title {
  font-size: 20px;
  letter-spacing: 2px;
  color: rgba(180, 220, 255, 0.9);
}

.close-btn {
  padding: 3px 8px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-size: 11px;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00e5ff;
}

.panel-content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
}

.info-row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(0, 229, 255, 0.05);
  border-radius: 3px;
}

.info-label {
  font-size: 13px;
  color: rgba(180, 220, 255, 0.6);
  min-width: 72px;
}

.info-value {
  font-size: 13px;
  color: rgba(180, 220, 255, 0.9);
}

.info-value.highlight {
  color: #ffe066;
  font-weight: bold;
}

.chart-section {
  height: 180px;
  min-height: 180px;
}

.expand-btn {
  position: fixed;
  top: 56px;
  right: 8px;
  padding: 6px 16px;
  background: rgba(17, 47, 83, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-size: 11px;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.expand-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00e5ff;
}
</style>