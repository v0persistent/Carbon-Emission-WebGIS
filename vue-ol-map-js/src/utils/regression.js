export function calculateRegression(xData, yData) {
  const n = xData.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0

  for (let i = 0; i < n; i++) {
    sumX += xData[i]
    sumY += yData[i]
    sumXY += xData[i] * yData[i]
    sumX2 += xData[i] * xData[i]
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  let ssTot = 0, ssRes = 0
  const meanY = sumY / n

  for (let i = 0; i < n; i++) {
    ssTot += Math.pow(yData[i] - meanY, 2)
    ssRes += Math.pow(yData[i] - (slope * xData[i] + intercept), 2)
  }

  const r2 = 1 - (ssRes / ssTot)

  return { slope, intercept, r2 }
}
