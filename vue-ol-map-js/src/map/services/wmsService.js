import { wmsBoundaryConfig } from '../../config/mapConfig'

export function buildWmsFeatureInfoUrl(source, coordinate, resolution, projection) {
  return source.getFeatureInfoUrl(
    coordinate,
    resolution,
    projection,
    {
      INFO_FORMAT: 'application/json',
      FEATURE_COUNT: 1,
      QUERY_LAYERS: wmsBoundaryConfig.layers.city
    }
  )
}

export async function fetchWmsFeatureInfo(url) {
  const response = await fetch(url)
  const data = await response.json()

  if (data.features && data.features.length > 0) {
    const properties = data.features[0].properties
    const cityName = properties[wmsBoundaryConfig.attributeNames.cityName]
    return { properties, cityName }
  }

  return null
}
