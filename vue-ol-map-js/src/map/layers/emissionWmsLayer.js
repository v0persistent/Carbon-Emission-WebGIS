import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import { emissionWmsConfig } from '../../config/mapConfig'

export function createEmissionWmsLayer() {
  const source = new ImageWMS({
    url: emissionWmsConfig.url,
    params: {
      LAYERS: emissionWmsConfig.layer,
      FORMAT: emissionWmsConfig.format,
      TRANSPARENT: emissionWmsConfig.transparent,
      SRS: emissionWmsConfig.srs,
      STYLES: ''
    },
    ratio: 1,
    serverType: 'geoserver'
  })

  const layer = new ImageLayer({
    source,
    visible: false,
    opacity: 0.5
  })

  return { layer, source }
}