import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style'

const busStopStyleCache = new Style({
  image: new CircleStyle({
    radius: 4,
    fill: new Fill({ color: 'rgba(255, 140, 0, 0.85)' }),
    stroke: new Stroke({ color: '#fff', width: 1 })
  })
})

export function getBusStopStyle() {
  return busStopStyleCache
}

export function getDefaultStyle(feature) {
  const geometryType = feature.getGeometry()?.getType()

  if (geometryType === 'Point' || geometryType === 'MultiPoint') {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: 'rgba(0, 229, 255, 0.75)' }),
        stroke: new Stroke({ color: '#001c2b', width: 2 })
      })
    })
  }

  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return new Style({
      stroke: new Stroke({ color: '#00e5ff', width: 3 })
    })
  }

  return new Style({
    fill: new Fill({ color: 'rgba(224, 224, 224, 0.4)' }),
    stroke: new Stroke({ color: '#00e5ff', width: 2 })
  })
}

export function getSelectedStyle(feature) {
  const geometryType = feature.getGeometry()?.getType()

  if (geometryType === 'Point' || geometryType === 'MultiPoint') {
    return new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: 'rgba(255, 224, 102, 0.95)' }),
        stroke: new Stroke({ color: '#00e5ff', width: 2 })
      })
    })
  }

  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return new Style({
      stroke: new Stroke({ color: '#ffe066', width: 5 })
    })
  }

  return new Style({
    fill: new Fill({ color: 'rgba(255, 224, 102, 0.4)' }),
    stroke: new Stroke({ color: '#00e5ff', width: 3 })
  })
}

export function getBoundaryDefaultStyle(feature) {
  return new Style({
    fill: new Fill({ color: 'rgba(220, 220, 220, 0.05)' }),
    stroke: new Stroke({ color: '#b0b0b0', width: 1 })
  })
}

export function getBoundaryHoverStyle(feature) {
  return new Style({
    fill: new Fill({ color: 'rgba(180, 180, 180, 0.15)' }),
    stroke: new Stroke({ color: '#909090', width: 1.5 })
  })
}

export function getBoundaryHighlightStyle(feature) {
  return new Style({
    fill: new Fill({ color: 'rgba(0, 229, 255, 0.15)' }),
    stroke: new Stroke({ color: '#00e5ff', width: 3 })
  })
}
