<template>
  <ChartPanel title="排放来源构成">
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
  dimension: { type: String, default: 'industry' }
})

const chartOption = computed(() => {
  if (!props.item) {
    return null
  }

  const dimensionKeys = props.dimension === 'industry' ? INDUSTRY_DIMENSION : SCOPE_DIMENSION
  const dimensionData = []
  dimensionKeys.forEach(key => {
    const value = props.item[key]
    if (value !== null && value !== undefined && value > 0) {
      dimensionData.push({ name: key, value })
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'center',
      textStyle: { color: '#b4dcff', fontSize: 12 }
    },
    series: [{
      name: '排放来源',
      type: 'pie',
      radius: ['30%', '65%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(17, 47, 83, 0.9)',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#b4dcff',
        fontSize: 12
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 229, 255, 0.5)' },
        length: 5,
        length2: 5
      },
      data: dimensionData.map((item, index) => ({
        ...item,
        itemStyle: { color: COLORS[index % COLORS.length] }
      }))
    }]
  }
})
</script>
