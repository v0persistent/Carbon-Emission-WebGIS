const years = ['2005', '2010', '2015', '2020'];
let cachedData = {};

function authHeaders() {
  const token = localStorage.getItem('token') || '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loadCo2Data(year) {
  if (cachedData[year]) {
    return cachedData[year];
  }

  const url = `/api/cities/${year}`;
  const response = await fetch(url, { headers: authHeaders() });
  const result = await response.json();
  const data = result.data || result;  // Spring Boot 返回 {code, data}，json-server 返回裸数组
  cachedData[year] = data;
  return data;
}

export function getTopEmissions(data, topN = 10) {
  return [...data]
    .filter(item => item['总排放'] !== null && item['总排放'] !== undefined)
    .sort((a, b) => b['总排放'] - a['总排放'])
    .slice(0, topN);
}

export function getScatterData(data) {
  return data
    .filter(item => 
      item['GDP'] !== null && item['GDP'] !== undefined && 
      item['总排放'] !== null && item['总排放'] !== undefined &&
      item['人均排放'] !== null && item['人均排放'] !== undefined
    )
    .map(item => {
      const perCapitaGdp = item['人均GDP'] !== null && item['人均GDP'] !== undefined 
        ? item['人均GDP'] 
        : (item['GDP'] / (item['总排放'] / item['人均排放'])) || null;
      return {
        name: item['城市名称'],
        province: item['省份'],
        gdp: item['GDP'],
        totalEmission: item['总排放'],
        perCapitaGdp: perCapitaGdp,
        perCapitaEmission: item['人均排放'],
        directEmission: item['直接排放'],
        indirectEmission: item['间接排放']
      };
    });
}

export function calculateRegression(xData, yData) {
  const n = xData.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += xData[i];
    sumY += yData[i];
    sumXY += xData[i] * yData[i];
    sumX2 += xData[i] * xData[i];
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  let ssTot = 0, ssRes = 0;
  const meanY = sumY / n;
  
  for (let i = 0; i < n; i++) {
    ssTot += Math.pow(yData[i] - meanY, 2);
    ssRes += Math.pow(yData[i] - (slope * xData[i] + intercept), 2);
  }
  
  const r2 = 1 - (ssRes / ssTot);
  
  return { slope, intercept, r2 };
}

export function getYears() {
  return years;
}

export async function loadCityMultiYearData(cityName) {
  const allYearsData = []
  for (const year of years) {
    const data = await loadCo2Data(year)
    const cityData = data.find(item => {
      const normalized = normalizeCityName(item['城市名称'])
      const target = normalizeCityName(cityName)
      return normalized === target || normalized.includes(target) || target.includes(normalized)
    })
    if (cityData) {
      allYearsData.push({ ...cityData, year: parseInt(year) })
    }
  }
  return allYearsData
}

function normalizeCityName(name) {
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

const METRIC_FIELD_MAP = {
  totalEmission: '总排放',
  perCapitaEmission: '人均排放',
  gdpEmission: 'GDP',
  directEmission: '直接排放',
  indirectEmission: '间接排放'
}

export function getCityRanking(data, year, metric, topN = 10) {
  const field = METRIC_FIELD_MAP[metric] || '总排放'

  const filtered = data.filter(
    item => item[field] !== null && item[field] !== undefined
  )

  const sorted = [...filtered].sort(
    (a, b) => (b[field] || 0) - (a[field] || 0)
  )

  return sorted.slice(0, topN).map(item => ({
    city: item['城市名称'],
    value: item[field]
  }))
}

export function getCityBottomRanking(data, year, metric, bottomN = 10) {
  const field = METRIC_FIELD_MAP[metric] || '总排放'

  const filtered = data.filter(
    item => item[field] !== null && item[field] !== undefined
  )

  const sorted = [...filtered].sort(
    (a, b) => (a[field] || 0) - (b[field] || 0)
  )

  return sorted.slice(0, bottomN).map(item => ({
    city: item['城市名称'],
    value: item[field]
  }))
}

export function getMetricLabel(metric) {
  const labelMap = {
    totalEmission: '总排放量',
    perCapitaEmission: '人均排放量',
    gdpEmission: 'GDP',
    directEmission: '直接排放量',
    indirectEmission: '间接排放量'
  }
  return labelMap[metric] || '总排放量'
}

export function getCityGrowthRanking(startData, endData, metric, topN = 10) {
  const field = METRIC_FIELD_MAP[metric] || '总排放'

  const endDataMap = new Map()
  endData.forEach(item => {
    const name = normalizeCityName(item['城市名称'])
    endDataMap.set(name, item)
  })

  const result = []
  startData.forEach(item => {
    const name = normalizeCityName(item['城市名称'])
    const endItem = endDataMap.get(name)
    if (
      endItem &&
      item[field] !== null && item[field] !== undefined &&
      endItem[field] !== null && endItem[field] !== undefined &&
      item[field] !== 0
    ) {
      const growthRate = ((endItem[field] - item[field]) / Math.abs(item[field])) * 100
      result.push({
        city: item['城市名称'],
        growthRate: Number(growthRate.toFixed(2)),
        startValue: item[field],
        endValue: endItem[field]
      })
    }
  })

  return result.sort((a, b) => b.growthRate - a.growthRate).slice(0, topN)
}

export function getCityGrowthBottomRanking(startData, endData, metric, bottomN = 10) {
  const field = METRIC_FIELD_MAP[metric] || '总排放'

  const endDataMap = new Map()
  endData.forEach(item => {
    const name = normalizeCityName(item['城市名称'])
    endDataMap.set(name, item)
  })

  const result = []
  startData.forEach(item => {
    const name = normalizeCityName(item['城市名称'])
    const endItem = endDataMap.get(name)
    if (
      endItem &&
      item[field] !== null && item[field] !== undefined &&
      endItem[field] !== null && endItem[field] !== undefined &&
      item[field] !== 0
    ) {
      const growthRate = ((endItem[field] - item[field]) / Math.abs(item[field])) * 100
      result.push({
        city: item['城市名称'],
        growthRate: Number(growthRate.toFixed(2)),
        startValue: item[field],
        endValue: endItem[field]
      })
    }
  })

  return result.sort((a, b) => a.growthRate - b.growthRate).slice(0, bottomN)
}

export function getCityTrendData(allYearsData, cities, metric) {
  const field = METRIC_FIELD_MAP[metric] || '总排放'
  const yearKeys = Object.keys(allYearsData)
    .map(Number)
    .sort((a, b) => a - b)

  const result = []

  cities.forEach(city => {
    const normalizedTarget = normalizeCityName(city)
    const series = []

    yearKeys.forEach(year => {
      const yearData = allYearsData[String(year)]
      if (!yearData) return

      const cityItem = yearData.find(
        item => normalizeCityName(item['城市名称']) === normalizedTarget
      )

      if (cityItem && cityItem[field] !== null && cityItem[field] !== undefined) {
        series.push({ year, value: cityItem[field] })
      }
    })

    if (series.length > 0) {
      result.push({ city, series })
    }
  })

  return result
}

export function getEfficiencyScatterData(data) {
  return data
    .filter(
      item =>
        item['总排放'] !== null &&
        item['总排放'] !== undefined &&
        item['GDP'] !== null &&
        item['GDP'] !== undefined &&
        item['GDP'] > 0
    )
    .map(item => {
      const gdpEmission = item['总排放'] / item['GDP']
      return {
        city: item['城市名称'],
        province: item['省份'],
        totalEmission: item['总排放'],
        gdpEmission: Number(gdpEmission.toFixed(4))
      }
    })
}

export function aggregateByProvince(data) {
  const result = {};
  
  data.forEach(item => {
    const province = item['省份'];
    if (!province) return;
    
    if (!result[province]) {
      result[province] = {
        province,
        totalEmission: 0,
        directEmission: 0,
        indirectEmission: 0,
        gdp: 0,
        count: 0
      };
    }
    
    result[province].totalEmission += item['总排放'] || 0;
    result[province].directEmission += item['直接排放'] || 0;
    result[province].indirectEmission += item['间接排放'] || 0;
    result[province].gdp += item['GDP'] || 0;
    result[province].count++;
  });
  
  return Object.values(result);
}