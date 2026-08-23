<template>
  <ChartPanel title="排放结构">
    <BaseChart :option="chartOption" />
  </ChartPanel>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'

const INDUSTRY_DIMENSION = ['农业', '服务业', '工业', '生活', '交通', '能源']
const SCOPE_DIMENSION = ['直接排放', '间接排放']
const COLORS = ['#00e5ff', '#0066cc', '#ffe066', '#ff6b6b', '#4ecdc4', '#95e1d3', '#a29bfe', '#fd79a8']

const props = defineProps({
  item: { type: Object, default: null },
  targetName: { type: String, default: '' },
  dimension: { type: String, default: 'industry' }
})

const chartOption = computed(() => {
  if (!props.item) {
    return null
  }

  const dimensionKeys = props.dimension === 'industry' ? INDUSTRY_DIMENSION : SCOPE_DIMENSION
  const dimensionData = dimensionKeys.map(key => {
    const value = props.item[key]
    return value !== null && value !== undefined ? value : 0
  })

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' }
    },
    // legend: {
    //   data: dimensionKeys,
    //   textStyle: { color: '#b4dcff', fontSize: 10 },
    //   bottom: '2%'
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [props.targetName],
      axisLabel: { color: '#b4dcff', fontSize: 13 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#b4dcff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } }
    },
    series: dimensionKeys.map((key, index) => ({
      name: key,
      type: 'bar',
      stack: 'total',
      itemStyle: { color: COLORS[index % COLORS.length] },
      emphasis: { focus: 'series' },
      data: [dimensionData[index]]
    }))
  }
})
</script>
