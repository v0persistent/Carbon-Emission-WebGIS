import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { tdtBasemapConfig } from '../../config/mapConfig'

const tdt3857TileGrid = new WMTSTileGrid(tdtBasemapConfig.tileGrid)

const basemapSources = {
  road: new WMTS({
    url: `http://t0.tianditu.gov.cn/vec_w/wmts?tk=${tdtBasemapConfig.tk}`,
    tileGrid: tdt3857TileGrid,
    ...tdtBasemapConfig.sources.road
  }),
  satellite: new WMTS({
    url: `http://t0.tianditu.gov.cn/img_w/wmts?tk=${tdtBasemapConfig.tk}`,
    tileGrid: tdt3857TileGrid,
    ...tdtBasemapConfig.sources.satellite
  })
}

export function createBasemapLayer(initialKey = 'road') {
  const layer = new TileLayer({
    source: basemapSources[initialKey]
  })

  return {
    layer,
    sources: basemapSources,
    switchTo(key) {
      layer.setSource(basemapSources[key])
    }
  }
}
