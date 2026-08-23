<template>
  <ChartPanel title="碳排放效率四象限分析">
    <BaseChart :option="chartOption" :on-chart-click="onChartClick" />
  </ChartPanel>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartPanel from './ChartPanel.vue'
import { getEfficiencyScatterData } from '../../services/co2DataService'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const emit = defineEmits(['city-click'])

function onChartClick(params) {
  const d = params.data[2]
  if (d?.city) {
    emit('city-click', d.city)
  }
}

const QUADRANT_COLORS = {
  q1: '#ef4444',
  q2: '#f59e0b',
  q3: '#22c55e',
  q4: '#4d96ff'
}

const QUADRANT_LABELS = {
  q1: '高排放·高碳强度',
  q2: '高排放·低碳强度',
  q3: '低排放·低碳强度',
  q4: '低排放·高碳强度'
}

const scatterData = computed(() => getEfficiencyScatterData(props.data))

const avgTotal = computed(() => {
  if (!scatterData.value.length) return 0
  const sum = scatterData.value.reduce((s, d) => s + d.totalEmission, 0)
  return sum / scatterData.value.length
})

const avgGdp = computed(() => {
  if (!scatterData.value.length) return 0
  const sum = scatterData.value.reduce((s, d) => s + d.gdpEmission, 0)
  return sum / scatterData.value.length
})

function classifyPoint(d) {
  const highTotal = d.totalEmission >= avgTotal.value
  const highGdp = d.gdpEmission >= avgGdp.value
  if (highTotal && highGdp) return 'q1'
  if (highTotal && !highGdp) return 'q2'
  if (!highTotal && !highGdp) return 'q3'
  return 'q4'
}

const quadrantGroups = computed(() => {
  const groups = { q1: [], q2: [], q3: [], q4: [] }
  scatterData.value.forEach(d => {
    groups[classifyPoint(d)].push(d)
  })
  return groups
})

const chartOption = computed(() => {
  if (!scatterData.value.length) return null

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 47, 83, 0.92)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: { color: '#b4dcff' },
      formatter: (params) => {
        const d = params.data[2]
        const q = classifyPoint(d)
        return [
          `<strong>${d.city}</strong>`,
          `省份：${d.province || '-'}`,
          `总排放：${d.totalEmission.toLocaleString()}`,
          `单位GDP碳排放：${d.gdpEmission.toFixed(4)}`,
          `<span style="color:${QUADRANT_COLORS[q]}">${QUADRANT_LABELS[q]}</span>`
        ].join('<br/>')
      }
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '8%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '单位GDP碳排放',
      nameTextStyle: { color: '#b4dcff', fontSize: 11 },
      axisLabel: { color: '#b4dcff', fontSize: 13 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } }
    },
    yAxis: {
      type: 'value',
      name: '总排放量',
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
    series: [
      {
        name: QUADRANT_LABELS.q1,
        type: 'scatter',
        symbolSize: 10,
        data: quadrantGroups.value.q1.map(d => [d.gdpEmission, d.totalEmission, d]),
        itemStyle: { color: QUADRANT_COLORS.q1, opacity: 0.85 },
        emphasis: { scale: 1.5, itemStyle: { opacity: 1 } },
        markLine: {
          silent: true,
          symbol: 'none',
          label: {
            color: '#b4dcff',
            fontSize: 11,
            formatter: (p) => p.name + '\n' + (typeof p.value === 'number' ? p.value.toFixed(2) : '')
          },
          lineStyle: { color: 'rgba(180, 220, 255, 0.3)', type: 'dashed', width: 1 },
          data: [
            { name: '平均碳强度', xAxis: avgGdp.value },
            { name: '平均总排放', yAxis: avgTotal.value }
          ]
        }
      },
      {
        name: QUADRANT_LABELS.q2,
        type: 'scatter',
        symbolSize: 10,
        data: quadrantGroups.value.q2.map(d => [d.gdpEmission, d.totalEmission, d]),
        itemStyle: { color: QUADRANT_COLORS.q2, opacity: 0.85 },
        emphasis: { scale: 1.5, itemStyle: { opacity: 1 } }
      },
      {
        name: QUADRANT_LABELS.q3,
        type: 'scatter',
        symbolSize: 10,
        data: quadrantGroups.value.q3.map(d => [d.gdpEmission, d.totalEmission, d]),
        itemStyle: { color: QUADRANT_COLORS.q3, opacity: 0.85 },
        emphasis: { scale: 1.5, itemStyle: { opacity: 1 } }
      },
      {
        name: QUADRANT_LABELS.q4,
        type: 'scatter',
        symbolSize: 10,
        data: quadrantGroups.value.q4.map(d => [d.gdpEmission, d.totalEmission, d]),
        itemStyle: { color: QUADRANT_COLORS.q4, opacity: 0.85 },
        emphasis: { scale: 1.5, itemStyle: { opacity: 1 } }
      }
    ]
  }
})
</script>