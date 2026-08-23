import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import { getDefaultStyle, getBusStopStyle } from '../styles/vectorStyles'
import { busStopVtConfig } from '../../config/mapConfig'

function buildBusStopVtUrl() {
  const staticParams = new URLSearchParams(busStopVtConfig.params).toString()
  return `${busStopVtConfig.baseUrl}?${staticParams}&TILEMATRIX=EPSG:900913:{z}&TILEROW={y}&TILECOL={x}`
}

export function createGeojsonLayer() {
  const source = new VectorSource()
  const format = new GeoJSON()

  const layer = new VectorLayer({
    source,
    style: getDefaultStyle
  })

  return { layer, source, format }
}

export function createBusStopVtLayer() {
  const layer = new VectorTileLayer({
    source: new VectorTileSource({
      format: new MVT(),
      url: buildBusStopVtUrl()
    }),
    style: getBusStopStyle
  })

  return { layer }
}
