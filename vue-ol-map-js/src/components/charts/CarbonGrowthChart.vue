<template>
  <ChartPanel :title="chartTitle">
    <BaseChart :option="chartOption" :on-chart-click="onChartClick" />
  </ChartPanel>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'
import {
  getCityGrowthRanking,
  getCityGrowthBottomRanking,
  getMetricLabel
} from '../../services/co2DataService'

const props = defineProps({
  startData: { type: Array, default: () => [] },
  endData: { type: Array, default: () => [] },
  metric: { type: String, default: 'totalEmission' },
  topN: { type: Number, default: 10 },
  mode: { type: String, default: 'top' }
})

const emit = defineEmits(['city-click'])

function onChartClick(params) {
  if (params.name) {
    emit('city-click', params.name)
  }
}

const label = computed(() => getMetricLabel(props.metric))

const chartTitle = computed(() => {
  const prefix = props.mode === 'bottom' ? 'Bottom' : 'Top'
  return `碳排放增长率 ${prefix} ${props.topN}`
})

const growthData = computed(() => {
  if (!props.startData.length || !props.endData.length) return []
  if (props.mode === 'bottom') {
    return getCityGrowthBottomRanking(props.startData, props.endData, props.metric, props.topN)
  }
  return getCityGrowthRanking(props.startData, props.endData, props.metric, props.topN)
})

const chartOption = computed(() => {
  if (!growthData.value.length) return null

  const cities = growthData.value.map(item => item.city).reverse()
  const rates = growthData.value.map(item => item.growthRate).reverse()

  const barColors = growthData.value.map(item => {
    return item.growthRate >= 0
      ? { color: '#ef4444', borderColor: '#f87171' }
      : { color: '#22c55e', borderColor: '#4ade80' }
  }).reverse()

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' },
      formatter: (params) => {
        const p = params[0]
        const d = growthData.value[growthData.value.length - 1 - p.dataIndex]
        if (!d) return ''
        const sign = d.growthRate >= 0 ? '+' : ''
        return `${d.city}<br/>${label.value}增长率：${sign}${d.growthRate}%`
      }
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '增长率 (%)',
      nameTextStyle: { color: '#b4dcff', fontSize: 11 },
      axisLabel: {
        color: '#b4dcff',
        fontSize: 13,
        formatter: (v) => {
          if (v >= 0) return '+' + v.toFixed(1) + '%'
          return v.toFixed(1) + '%'
        }
      },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: cities,
      axisLabel: {
        color: '#b4dcff',
        fontSize: 13,
        width: 60,
        overflow: 'truncate'
      },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      barWidth: '55%',
      data: rates.map((rate, index) => ({
        value: rate,
        itemStyle: {
          color: barColors[index].color,
          borderRadius: [0, 4, 4, 0]
        },
        emphasis: {
          itemStyle: { color: barColors[index].borderColor }
        }
      })),
      label: {
        show: true,
        position: 'right',
        color: '#b4dcff',
        fontSize: 13,
        formatter: (p) => {
          if (p.value >= 0) return '+' + p.value.toFixed(1) + '%'
          return p.value.toFixed(1) + '%'
        }
      }
    }]
  }
})
</script>