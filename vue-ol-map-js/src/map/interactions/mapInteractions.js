import { toLonLat } from 'ol/proj'

export function setupMapInteractions(map, { onFeatureClick, onNoFeatureClick, onPointerMove }) {
  map.on('click', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)

    if (!feature) {
      onNoFeatureClick(evt)
      return
    }

    onFeatureClick(feature, evt)
  })

  map.on('pointermove', (evt) => {
    const [lon, lat] = toLonLat(evt.coordinate)
    onPointerMove({ lon, lat })
  })
}
