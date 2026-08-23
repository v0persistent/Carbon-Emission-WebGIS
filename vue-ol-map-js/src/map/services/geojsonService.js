export async function fetchGeojson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.json()
}

function buildUrlWithParams(url, params = {}) {
  const urlObject = new URL(url, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlObject.searchParams.set(key, String(value))
    }
  })

  return urlObject.toString()
}

function getVectorSourceUrl(dataSource) {
  const { request } = dataSource

  if (!request?.params) {
    return request.url
  }

  return buildUrlWithParams(request.url, request.params)
}

export function readGeojsonFeatures(geojsonFormat, geojson, projection = {}) {
  const { dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857' } = projection

  return geojsonFormat.readFeatures(geojson, {
    dataProjection,
    featureProjection
  })
}

export async function loadVectorFeaturesBySource(dataSource, geojsonFormat) {
  const vectorServiceTypes = ['geojson', 'api', 'wfs']

  if (!vectorServiceTypes.includes(dataSource.serviceType)) {
    throw new Error(`暂不支持 ${dataSource.serviceType} 矢量加载`)
  }

  const url = getVectorSourceUrl(dataSource)
  const geojson = await fetchGeojson(url)
  return readGeojsonFeatures(geojsonFormat, geojson, dataSource.projection)
}

export function replaceSourceFeatures(source, features) {
  source.clear()
  source.addFeatures(features)
}
