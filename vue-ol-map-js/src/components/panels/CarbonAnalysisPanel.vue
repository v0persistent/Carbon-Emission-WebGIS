<template>
  <div class="carbon-analysis-panel">
    <div class="panel-header">
      <span class="panel-title">碳排放图表分析</span>
      <div class="panel-controls">
        <div class="control-group">
          <span class="control-label">年份</span>
          <select v-model="localYear" class="control-select">
            <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">起始年</span>
          <select v-model="localStartYear" class="control-select">
            <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">结束年</span>
          <select v-model="localEndYear" class="control-select">
            <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">指标</span>
          <select v-model="localMetric" class="control-select">
            <option value="totalEmission">总排放量</option>
            <option value="perCapitaEmission">人均排放量</option>
            <option value="gdpEmission">GDP</option>
            <option value="directEmission">直接排放量</option>
            <option value="indirectEmission">间接排放量</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Top N</span>
          <select v-model.number="localTopN" class="control-select control-select-sm">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
          </select>
        </div>
        <div class="control-group">
          <button
            :class="['mode-btn', { active: localMode === 'top' }]"
            @click="localMode = 'top'"
          >Top</button>
          <button
            :class="['mode-btn', { active: localMode === 'bottom' }]"
            @click="localMode = 'bottom'"
          >Bottom</button>
        </div>
        <div class="control-group city-picker">
          <span class="control-label">趋势城市</span>
          <div class="multi-select" @click.self="showDropdown = !showDropdown">
            <div class="multi-select-trigger" @click="showDropdown = !showDropdown">
              <span v-if="localSelectedCities.length" class="multi-select-text">
                {{ localSelectedCities.length }}个城市
              </span>
              <span v-else class="multi-select-placeholder">选择城市</span>
              <span class="multi-select-arrow">&#9662;</span>
            </div>
            <div v-if="showDropdown" class="multi-select-dropdown">
              <div class="dropdown-header">
                <button class="dropdown-action" @click="selectAllCities">全选</button>
                <button class="dropdown-action" @click="localSelectedCities = []">清除</button>
              </div>
              <div
                v-for="city in allCitiesList"
                :key="city"
                :class="['dropdown-item', { checked: localSelectedCities.includes(city) }]"
                @click="toggleCity(city)"
              >
                <span class="dropdown-check">&#10003;</span>
                <span>{{ city }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <slot
        :year="localYear"
        :metric="localMetric"
        :top-n="localTopN"
        :mode="localMode"
        :start-year="localStartYear"
        :end-year="localEndYear"
      ></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  year: { type: String, default: '2020' },
  startYear: { type: String, default: '2005' },
  endYear: { type: String, default: '2020' },
  metric: { type: String, default: 'totalEmission' },
  topN: { type: Number, default: 10 },
  mode: { type: String, default: 'top' },
  allCitiesList: { type: Array, default: () => [] },
  selectedCities: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'update:year',
  'update:startYear',
  'update:endYear',
  'update:metric',
  'update:topN',
  'update:mode',
  'update:selectedCities'
])

const years = ['2005', '2010', '2015', '2020']

const localYear = ref(props.year)
const localStartYear = ref(props.startYear)
const localEndYear = ref(props.endYear)
const localMetric = ref(props.metric)
const localTopN = ref(props.topN)
const localMode = ref(props.mode)
const localSelectedCities = ref([...props.selectedCities])
const showDropdown = ref(false)

watch(localYear, (v) => emit('update:year', v))
watch(localStartYear, (v) => emit('update:startYear', v))
watch(localEndYear, (v) => emit('update:endYear', v))
watch(localMetric, (v) => emit('update:metric', v))
watch(localTopN, (v) => emit('update:topN', v))
watch(localMode, (v) => emit('update:mode', v))
watch(localSelectedCities, (v) => emit('update:selectedCities', [...v]), { deep: true })

function toggleCity(city) {
  const idx = localSelectedCities.value.indexOf(city)
  if (idx >= 0) {
    localSelectedCities.value.splice(idx, 1)
  } else {
    localSelectedCities.value.push(city)
  }
}

function selectAllCities() {
  localSelectedCities.value = [...props.allCitiesList]
}

function handleClickOutside(e) {
  if (!e.target.closest('.multi-select')) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.carbon-analysis-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.panel-header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-title {
  font-size: 14px;
  letter-spacing: 2px;
  color: rgba(180, 220, 255, 0.85);
  white-space: nowrap;
}

.panel-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-label {
  font-size: 11px;
  color: rgba(180, 220, 255, 0.6);
  white-space: nowrap;
}

.control-select {
  padding: 4px 8px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: #b4dcff;
  font-size: 11px;
  cursor: pointer;
}

.control-select:focus {
  outline: none;
  border-color: #00e5ff;
}

.control-select option {
  background: #112f53;
  color: #b4dcff;
}

.control-select-sm {
  width: 52px;
}

.mode-btn {
  padding: 4px 10px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.5);
  font-size: 11px;
  cursor: pointer;
}

.mode-btn:first-child {
  border-radius: 3px 0 0 3px;
}

.mode-btn:last-child {
  border-radius: 0 3px 3px 0;
}

.mode-btn.active {
  background: rgba(0, 229, 255, 0.15);
  border-color: #00e5ff;
  color: #00e5ff;
}

.city-picker {
  position: relative;
}

.multi-select {
  position: relative;
}

.multi-select-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: #b4dcff;
  font-size: 11px;
  cursor: pointer;
  min-width: 80px;
  user-select: none;
}

.multi-select-trigger:hover {
  border-color: rgba(0, 229, 255, 0.4);
}

.multi-select-placeholder {
  color: rgba(180, 220, 255, 0.35);
}

.multi-select-text {
  color: #b4dcff;
}

.multi-select-arrow {
  font-size: 8px;
  margin-left: auto;
}

.multi-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 140px;
  max-height: 220px;
  overflow-y: auto;
  background: rgba(10, 30, 55, 0.96);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 4px;
  z-index: 300;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.dropdown-header {
  display: flex;
  gap: 4px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  position: sticky;
  top: 0;
  background: rgba(10, 30, 55, 0.96);
}

.dropdown-action {
  padding: 2px 8px;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.7);
  font-size: 10px;
  cursor: pointer;
}

.dropdown-action:hover {
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  color: rgba(180, 220, 255, 0.75);
  font-size: 11px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(0, 229, 255, 0.08);
}

.dropdown-item.checked {
  color: #00e5ff;
}

.dropdown-item.checked .dropdown-check {
  opacity: 1;
}

.dropdown-check {
  opacity: 0;
  font-size: 11px;
  width: 14px;
}

.panel-body {
  flex: 1;
  min-height: 0;
  padding: 16px 20px;
}
</style>