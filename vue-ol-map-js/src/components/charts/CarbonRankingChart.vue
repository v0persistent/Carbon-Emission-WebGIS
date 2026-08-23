<template>
  <ChartPanel :title="chartTitle">
    <BaseChart :option="chartOption" :on-chart-click="onChartClick" />
  </ChartPanel>
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'
import {
  getCityRanking,
  getCityBottomRanking,
  getMetricLabel
} from '../../services/co2DataService'

const props = defineProps({
  data: { type: Array, default: () => [] },
  topN: { type: Number, default: 10 },
  metric: { type: String, default: '' },
  mode: { type: String, default: 'top' }
})

const emit = defineEmits(['city-click'])

function onChartClick(params) {
  if (params.name) {
    emit('city-click', params.name)
  }
}

const chartTitle = computed(() => {
  if (!props.metric) return '城市总排放量 Top 10'
  const label = getMetricLabel(props.metric)
  const prefix = props.mode === 'bottom' ? 'Bottom' : 'Top'
  return `城市${label} ${prefix} ${props.topN}`
})

const rankingData = computed(() => {
  if (!props.data.length) return []
  if (props.metric) {
    if (props.mode === 'bottom') {
      return getCityBottomRanking(props.data, null, props.metric, props.topN)
    }
    return getCityRanking(props.data, null, props.metric, props.topN)
  }
  // backward compat: old behavior without metric prop
  return [...props.data]
    .filter(item => item['总排放'] !== null && item['总排放'] !== undefined)
    .sort((a, b) => b['总排放'] - a['总排放'])
    .slice(0, props.topN)
    .map(item => ({
      city: item['城市名称'],
      value: item['总排放']
    }))
})

const chartOption = computed(() => {
  if (!rankingData.value.length) return null

  const cities = rankingData.value.map(item => item.city).reverse()
  const values = rankingData.value.map(item => item.value).reverse()
  const label = props.metric ? getMetricLabel(props.metric) : '总排放量'

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' },
      formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>${label}：${p.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: label,
      nameTextStyle: { color: '#b4dcff', fontSize: 11 },
      axisLabel: {
        color: '#b4dcff',
        fontSize: 13,
        formatter: (v) => {
          if (v >= 10000) return (v / 10000).toFixed(1) + '万'
          return v
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
      data: values,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#0066cc' },
          { offset: 1, color: '#00e5ff' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#0088ff' },
            { offset: 1, color: '#00ffff' }
          ])
        }
      },
      label: {
        show: true,
        position: 'right',
        color: '#b4dcff',
        fontSize: 13,
        formatter: (p) => {
          if (p.value >= 10000) return (p.value / 10000).toFixed(1) + '万'
          return p.value.toLocaleString()
        }
      }
    }]
  }
})
</script>
