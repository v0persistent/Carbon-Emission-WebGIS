<template>
  <ChartPanel title="经济增长与碳排放相关性">
    <template #default>
      <div v-if="axisOptions.length" class="regression-controls">
        <select v-model="localAxis" class="select-control-small">
          <option v-for="opt in axisOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <BaseChart :option="chartOption" />
    </template>
  </ChartPanel>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'
import { calculateRegression } from '../../utils/regression'
import { loadCityMultiYearData } from '../../services/co2DataService'

const props = defineProps({
  data: { type: Array, default: () => [] },
  axis: { type: String, default: 'gdp-emission' },
  selectedTarget: { type: String, default: '' },
  targetType: { type: String, default: 'city' }
})

const localAxis = ref(props.axis)
const multiYearData = ref([])

watch(() => props.axis, (val) => { localAxis.value = val })

watch(() => props.selectedTarget, async (newTarget) => {
  if (newTarget && props.targetType === 'city') {
    multiYearData.value = await loadCityMultiYearData(newTarget)
  } else {
    multiYearData.value = []
  }
}, { immediate: true })

const axisOptions = [
  { value: 'gdp-emission', label: 'GDP vs 总排放' },
  { value: 'percapita', label: '人均GDP vs 人均排放' }
]

const chartOption = computed(() => {
  if (props.selectedTarget && props.targetType === 'city' && multiYearData.value.length > 0) {
    return buildTimeSeriesOption()
  }
  return buildEmptyOption()
})

function buildTimeSeriesOption() {
  const isPerCapita = localAxis.value === 'percapita'
  const data = multiYearData.value.filter(item =>
    item['GDP'] !== null && item['GDP'] !== undefined &&
    item['总排放'] !== null && item['总排放'] !== undefined
  )

  if (data.length < 2) return buildEmptyOption()

  const xData = data.map(item => {
    if (isPerCapita) {
      return item['人均GDP'] !== null && item['人均GDP'] !== undefined
        ? item['人均GDP']
        : (item['GDP'] / (item['总排放'] / item['人均排放']))
    }
    return item['GDP']
  })
  const yData = data.map(item => isPerCapita ? item['人均排放'] : item['总排放'])
  const years = data.map(item => item.year)

  const regression = calculateRegression(xData, yData)

  const xMin = Math.min(...xData) * 0.9
  const xMax = Math.max(...xData) * 1.1
  const trendLineData = [
    { x: xMin, y: regression.slope * xMin + regression.intercept },
    { x: xMax, y: regression.slope * xMax + regression.intercept }
  ]

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' },
      formatter: (params) => {
        const item = data[params.dataIndex]
        if (!item) return ''
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; color: #00e5ff;">${item['城市名称']}（${item.year}年）</div>
            <div>GDP：${item['GDP']} 亿元</div>
            <div>总排放：${item['总排放']}</div>
            <div>人均排放：${item['人均排放'] ? item['人均排放'].toFixed(2) : 'N/A'} 吨/人</div>
          </div>
        `
      }
    },
    grid: {
      left: '0%',
      right: '25%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: isPerCapita ? '人均GDP' : 'GDP（亿元）',
      nameTextStyle: { color: '#b4dcff', fontSize: 12 },
      axisLabel: { color: '#b4dcff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } }
    },
    yAxis: {
      type: 'value',
      name: isPerCapita ? '人均排放（吨/人）' : '总排放量',
      nameTextStyle: { color: '#b4dcff', fontSize: 12 },
      axisLabel: { color: '#b4dcff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } }
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 14,
        data: data.map((item, index) => ({
          value: [xData[index], yData[index]],
          name: `${item.year}年`
        })),
        itemStyle: { color: '#00e5ff' },
        label: {
          show: true,
          formatter: (params) => `${years[params.dataIndex]}`,
          position: 'top',
          color: '#ffe066',
          fontSize: 10
        }
      },
      {
        type: 'line',
        name: `回归拟合线 (R²=${regression.r2.toFixed(4)})`,
        data: trendLineData.map(item => [item.x, item.y]),
        smooth: false,
        showSymbol: false,
        lineStyle: {
          color: '#ffe066',
          type: 'dashed',
          width: 2
        }
      }
    ],
    legend: {
      data: [`回归拟合线 (R²=${regression.r2.toFixed(4)})`],
      textStyle: { color: '#b4dcff', fontSize: 10 },
      bottom: '1%'
    }
  }
}

function buildEmptyOption() {
  return {
    title: {
      text: '请选择城市查看经济增长与碳排放关系',
      left: 'center',
      top: 'center',
      textStyle: { color: 'rgba(180, 220, 255, 0.5)', fontSize: 12 }
    }
  }
}
</script>

<style scoped>
.regression-controls {
  margin-bottom: 4px;
}

.select-control-small {
  padding: 3px 6px;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 3px;
  color: #b4dcff;
  font-size: 10px;
  cursor: pointer;
}

.select-control-small:focus {
  outline: none;
  border-color: #00e5ff;
}
</style>
