import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import { wmsBoundaryConfig, wfsBoundaryConfig } from '../../config/mapConfig'
import { getBoundaryDefaultStyle } from '../styles/vectorStyles'

export function createBoundaryWmsLayer() {
  const source = new ImageWMS({
    url: wmsBoundaryConfig.url,
    params: {
      LAYERS: wmsBoundaryConfig.layers.city,
      FORMAT: wmsBoundaryConfig.format,
      TRANSPARENT: wmsBoundaryConfig.transparent,
      SRS: wmsBoundaryConfig.srs
    },
    ratio: 1,
    serverType: 'geoserver'
  })

  const layer = new ImageLayer({
    source,
    visible: true
  })

  return { layer, source }
}

export function createBoundaryWfsLayer() {
  const source = new VectorSource()
  const format = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })

  const layer = new VectorLayer({
    source,
    style: getBoundaryDefaultStyle,
    visible: true
  })

  return { layer, source, format }
}
