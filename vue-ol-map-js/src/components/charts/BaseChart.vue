<template>
  <div ref="chartRef" class="base-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    default: null
  },
  onChartClick: {
    type: Function,
    default: null
  }
})

const chartRef = ref(null)
let chartInstance = null

function isValidOption(opt) {
  if (!opt) return false
  if (!opt.series || !opt.series.length) return false
  return true
}

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) return
  chartInstance = echarts.init(chartRef.value)
  if (isValidOption(props.option)) {
    chartInstance.setOption(props.option)
  }
  bindClick()
}

function bindClick() {
  if (!chartInstance || !props.onChartClick) return
  chartInstance.off('click')
  chartInstance.on('click', (params) => {
    props.onChartClick(params)
  })
}

function setOption(option, opts) {
  if (!chartInstance) return
  chartInstance.setOption(option, opts)
}

function resize() {
  chartInstance?.resize()
}

function handleWindowResize() {
  chartInstance?.resize()
}

watch(() => props.option, (newOption) => {
  if (!chartInstance) return
  if (!isValidOption(newOption)) {
    chartInstance.clear()
    return
  }
  nextTick(() => {
    chartInstance.setOption(newOption, { notMerge: true })
    bindClick()
  })
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({ setOption, resize })
</script>

<style scoped>
.base-chart {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
