<template>
  <ChartPanel title="趋势对比">
    <BaseChart :option="chartOption" />
  </ChartPanel>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'
import { getCityTrendData, getMetricLabel } from '../../services/co2DataService'
import { useSharedStore } from '../../shared/stores/sharedStore'

const props = defineProps({
  allYearsData: { type: Object, default: () => ({}) },
  cities: { type: Array, default: () => [] },
  metric: { type: String, default: 'totalEmission' }
})

const sharedStore = useSharedStore()

const activeCities = computed(() => {
  if (props.cities.length) return props.cities
  return sharedStore.selectedCitiesForTrend
})

const COLOR_PALETTE = [
  '#00e5ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#ff922b', '#20c997', '#e599f7', '#74c0fc', '#f06595'
]

const label = computed(() => getMetricLabel(props.metric))

const trendData = computed(() => {
  if (!Object.keys(props.allYearsData).length || !activeCities.value.length) return []
  return getCityTrendData(props.allYearsData, activeCities.value, props.metric)
})

const allYears = computed(() => {
  if (!trendData.value.length) return []
  const yearSet = new Set()
  trendData.value.forEach(city => {
    city.series.forEach(s => yearSet.add(s.year))
  })
  return [...yearSet].sort((a, b) => a - b)
})

const chartOption = computed(() => {
  if (!trendData.value.length) return null

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 47, 83, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' }
    },
    legend: {
      data: trendData.value.map(d => d.city),
      bottom: 0,
      textStyle: { color: '#b4dcff', fontSize: 13 },
      itemWidth: 14,
      itemHeight: 8,
      type: 'scroll'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: allYears.value.map(y => y + '年'),
      axisLabel: { color: '#b4dcff', fontSize: 13 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: label.value,
      nameTextStyle: { color: '#b4dcff', fontSize: 13 },
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
    series: trendData.value.map((cityData, i) => ({
      name: cityData.city,
      type: 'line',
      data: allYears.value.map(year => {
        const point = cityData.series.find(s => s.year === year)
        return point ? point.value : null
      }),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: COLOR_PALETTE[i % COLOR_PALETTE.length],
        width: 2
      },
      itemStyle: {
        color: COLOR_PALETTE[i % COLOR_PALETTE.length]
      }
    }))
  }
})
</script>