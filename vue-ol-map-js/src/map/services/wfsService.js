import { wfsBoundaryConfig } from '../../config/mapConfig'

export async function fetchWfsBoundaryFeatures(format) {
  const url = `${wfsBoundaryConfig.url}?service=WFS&version=1.1.0&request=GetFeature&typeName=${wfsBoundaryConfig.layerName}&outputFormat=${wfsBoundaryConfig.outputFormat}&srsName=${wfsBoundaryConfig.srsName}`

  const response = await fetch(url)
  const data = await response.json()
  const features = format.readFeatures(data)

  features.forEach(feature => {
    feature.set('source', 'boundaryWfs')
  })

  return features
}

export function findBoundaryFeatureByName(features, cityName, normalizeFn) {
  const normalizedCityName = normalizeFn(cityName)

  return features.find(feature => {
    const featureName = normalizeFn(feature.get(wfsBoundaryConfig.attributeNames.cityName) || '')
    return featureName.includes(normalizedCityName) || normalizedCityName.includes(featureName)
  })
}
