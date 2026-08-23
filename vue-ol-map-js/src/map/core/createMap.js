import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat, transformExtent } from 'ol/proj'

export function createMap({ target, center, zoom, minZoom, maxZoom, extent4326 }) {
  const extent = extent4326 ? transformExtent(extent4326, 'EPSG:4326', 'EPSG:3857') : undefined

  return new Map({
    target,
    view: new View({
      center: fromLonLat(center),
      zoom,
      minZoom,
      maxZoom,
      extent,
      showFullExtent: true
    })
  })
}
