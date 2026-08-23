<template>
  <div class="control-panel">
    <div class="panel-header">
      <div class="panel-title">功能面板</div>
      <button class="close-btn" @click="togglePanel">
        {{ isCollapsed ? '展开' : '收起' }}
      </button>
    </div>

    <div v-show="!isCollapsed" class="panel-content">
      <div class="panel-section">
        <div class="section-title">数据筛选区</div>
        <div class="control-row">
          <span class="control-label">年份：</span>
          <select v-model="selectedYear" class="select-control">
            <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
          </select>
        </div>
        <div class="control-row">
          <span class="control-label">区域：</span>
          <div class="search-box">
            <input
              v-model="searchText"
              class="input"
              type="text"
              placeholder="搜索城市/省份"
              @keyup.enter="searchTarget"
            >
            <button class="search-btn" @click="searchTarget">搜索</button>
          </div>
        </div>
        <div v-if="searchStatus" class="search-status">{{ searchStatus }}</div>
      </div>

      <div class="panel-section">
        <div class="section-title">碳排放专题区</div>
        <div class="control-row">
          <span class="control-label">指标：</span>
          <select v-model="store.emissionIndicator" class="select-control" @change="onIndicatorChange">
            <option value="">请选择</option>
            <option v-for="item in emissionIndicators" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div v-if="detailOptions.length" class="control-row">
          <span class="control-label">具体指标：</span>
          <select v-model="store.emissionDetailIndicator" class="select-control" @change="onDetailChange">
            <option value="">请选择</option>
            <option v-for="detail in detailOptions" :key="detail" :value="detail">{{ detail }}</option>
          </select>
        </div>
      </div>

      <div class="panel-section">
        <div class="section-title">经济与人口专题区</div>
        <div class="button-group">
          <button
            :class="['btn', { active: store.activeEconTab === 'population' }]"
            @click="activateEconTab('population')"
          >
            常住人口
          </button>
          <button
            :class="['btn', { active: store.activeEconTab === 'gdp' }]"
            @click="activateEconTab('gdp')"
          >
            GDP
          </button>
          <button
            :class="['btn', { active: store.activeEconTab === 'perCapitaGdp' }]"
            @click="activateEconTab('perCapitaGdp')"
          >
            人均GDP
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useSharedStore } from '../../shared/stores/sharedStore'
import { loadCo2Data, aggregateByProvince } from '../../services/co2DataService'
import { useMapChartOrchestrator } from '../../orchestrators/mapChartOrchestrator'
import { emissionIndicators, emissionDetailMap } from '../../config/mapConfig'

const store = useSharedStore()
const orchestrator = useMapChartOrchestrator()

const isCollapsed = ref(false)
const selectedYear = ref('2005')
const searchText = ref('')
const searchStatus = ref('')

const years = ['2005', '2010', '2015', '2020']

const detailOptions = computed(() => {
  if (!store.emissionIndicator) return []
  return emissionDetailMap[store.emissionIndicator] || []
})

watch(() => store.emissionIndicator, (newVal) => {
  if (!newVal || !emissionDetailMap[newVal]) {
    store.setEmissionDetail('')
  }
})

watch(selectedYear, (newVal) => {
  store.setYear(newVal)
}, { immediate: true })

function onIndicatorChange() {
  if (!detailOptions.value.length) {
    store.setEmissionDetail('')
  }
}

function onDetailChange() {
}

function activateEconTab(tab) {
  store.setActiveEconTab(tab)
  store.setEmissionIndicator(tab)
  store.setEmissionDetail('')
}

const normalizeCityName = (name) => {
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

const findMatch = (data, keyword) => {
  const normalized = normalizeCityName(keyword)
  const cityMatch = data.find(d => {
    const name = normalizeCityName(d['城市名称'])
    return name.includes(normalized) || normalized.includes(name)
  })
  if (cityMatch) return { name: cityMatch['城市名称'], type: 'city' }

  const provinceData = aggregateByProvince(data)
  const provinceMatch = provinceData.find(p => {
    const name = normalizeCityName(p.province)
    return name.includes(normalized) || normalized.includes(name)
  })
  if (provinceMatch) return { name: provinceMatch.province, type: 'province' }

  return null
}

const searchTarget = async () => {
  const keyword = searchText.value.trim()
  if (!keyword) return

  searchStatus.value = '搜索中...'
  try {
    const data = await loadCo2Data(selectedYear.value)
    const match = findMatch(data, keyword)
    if (match) {
      searchStatus.value = `已选中：${match.name}`
      orchestrator.onChartTargetChange({ name: match.name, type: match.type })
    } else {
      searchStatus.value = '未找到匹配结果'
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchStatus.value = '搜索失败'
  }
}

const togglePanel = () => {
  isCollapsed.value = !isCollapsed.value
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })
}
</script>

<style scoped>
.control-panel {
  position: fixed;
  top: 56px;
  left: 8px;
  width: 280px;
  box-sizing: border-box;
  background: rgba(17, 47, 83, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
  z-index: 100;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  cursor: pointer;
  flex-shrink: 0;
}

.panel-header .panel-title {
  font-size: 18px;
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
  gap: 12px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
}

.panel-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(180, 220, 255, 0.7);
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  padding-bottom: 6px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-label {
  font-size: 13px;
  color: rgba(180, 220, 255, 0.7);
  min-width: 52px;
  flex-shrink: 0;
}

.select-control {
  flex: 1;
  padding: 4px 6px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: #b4dcff;
  font-size: 11px;
  cursor: pointer;
}

.select-control:focus {
  outline: none;
  border-color: #00e5ff;
}

.select-control option {
  background: #112f53;
  color: #b4dcff;
}

.search-box {
  flex: 1;
  display: flex;
  gap: 4px;
}

.input {
  flex: 1;
  padding: 4px 6px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: #b4dcff;
  font-size: 11px;
  outline: none;
  min-width: 0;
  box-sizing: border-box;
}

.input::placeholder {
  color: rgba(180, 220, 255, 0.45);
}

.input:focus {
  border-color: #00e5ff;
}

.search-btn {
  padding: 4px 8px;
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;
}

.search-btn:hover {
  background: rgba(0, 229, 255, 0.25);
  border-color: #00e5ff;
}

.search-status {
  font-size: 13px;
  color: #ffe066;
  padding: 2px 4px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 12px;
  background: rgba(0, 229, 255, 0.07);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
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