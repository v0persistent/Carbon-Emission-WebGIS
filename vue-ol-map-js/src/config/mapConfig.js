export const initialCenter = [104.0, 35.5]
export const initialZoom = 4
// export const chinaExtent4326 = [73.0, 18.0, 135.0, 54.0]
export const chinaExtent4326 = [60.0, 10.0, 150.0, 54.0]

// GeoServer WMS行政区划图层配置
export const wmsBoundaryConfig = {
  url: 'http://localhost:8080/geoserver/china_boundary/wms',
  layers: {
    province: 'china_boundary:china_sheng',
    city: 'china_boundary:china_shi'
  },
  format: 'image/png',
  transparent: true,
  srs: 'EPSG:4326',
  attributeNames: {
    cityName: '地名',
    cityCode: '区划码',
    provinceCode: '省级'
  }
}

// GeoServer WFS行政区划矢量图层配置
export const wfsBoundaryConfig = {
  url: 'http://localhost:8080/geoserver/china_boundary/wfs',
  layerName: 'china_boundary:china_shi',
  outputFormat: 'application/json',
  srsName: 'EPSG:4326',
  attributeNames: {
    cityName: '地名',
    cityCode: '区划码',
    provinceCode: '省级'
  }
}


// GeoServer WMS 碳排放专题图层配置
export const emissionWmsConfig = {
  url: 'http://localhost:8080/geoserver/china_boundary/wms',
  layer: 'china_boundary:shi_co2',
  format: 'image/png',
  transparent: true,
  srs: 'EPSG:4326',
  style: 'EM_co2_level'
}

// 年份 → 样式名后缀
export const yearSuffixMap = {
  2005: '05',
  2010: '10',
  2015: '15',
  2020: '20'
}

// 碳排放指标 → GeoServer 样式名（= SLD 文件名不含 .xml）
export const emissionStyleMap = {
  total: 'co_style',
  perCapita: 'co_perc',
  perGdp: 'co_per_emis',
  agriculture: 'co_agri',
  service: 'co_serv',
  industry: 'co_indtota',
  residential: 'co_hh',
  transport: 'co_trans',
  energy: 'co_ener',
  population: 'perm_style',
  gdp: 'gd_style',
  perCapitaGdp: 'gdp_per_style',
  '直接排放': 'co_dir',
  '间接排放': 'co_indir',
  '工业能源碳排': 'co_indener',
  '工业过程碳排': 'co_indproc',
  '工业总碳排': 'co_indtota',
  '城镇生活碳排': 'co_urbanh',
  '农村生活碳排': 'co_rura',
  '生活总碳排': 'co_hh',
  '道路碳排': 'co_road',
  '铁路碳排': 'co_railway',
  '水运碳排': 'co_watern',
  '航空碳排': 'co_avia',
  '交通总碳排': 'co_trans'
}

// 碳排放指标分类
export const emissionIndicators = [
  { value: 'total', label: '总碳排' },
  { value: 'perCapita', label: '人均碳排' },
  { value: 'perGdp', label: '单位GDP碳排' },
  { value: 'agriculture', label: '农业碳排' },
  { value: 'service', label: '服务业碳排' },
  { value: 'industry', label: '工业碳排' },
  { value: 'residential', label: '生活碳排' },
  { value: 'transport', label: '交通碳排' },
  { value: 'energy', label: '能源碳排' },
  // { value: 'population', label: '常住人口' },
  // { value: 'gdp', label: 'GDP' },
  // { value: 'perCapitaGdp', label: '人均GDP' }
]

// 碳排放具体指标映射（按指标 value）
export const emissionDetailMap = {
  total: ['直接排放', '间接排放'],
  industry: ['工业能源碳排', '工业过程碳排', '工业总碳排'],
  residential: ['城镇生活碳排', '农村生活碳排', '生活总碳排'],
  transport: ['道路碳排', '铁路碳排', '水运碳排', '航空碳排', '交通总碳排']
}

// 碳排放字段映射表（年份 → 指标key → GeoServer属性字段名）
// 字段名格式说明：前缀为指标缩写，后缀 _年份后两位
// 例如：E2020 = 总碳排放2020, Ener_15 = 能源碳排2015
export const emissionFieldMap = {
  2005: {
    total: 'E2005', perCapita: 'Percapi_05', perGdp: 'CO2emis_05',
    agriculture: 'Agri_05', service: 'Serv_05', industry: 'Indtota_05',
    residential: 'HH_05', transport: 'Trans_05', energy: 'Ener_05'
  },
  2010: {
    total: 'E2010', perCapita: 'Percapi_10', perGdp: 'CO2emis_10',
    agriculture: 'Agri_10', service: 'Serv_10', industry: 'Indtota_10',
    residential: 'HH_10', transport: 'Trans_10', energy: 'Ener_10'
  },
  2015: {
    total: 'E2015', perCapita: 'Percapi_15', perGdp: 'CO2emis_15',
    agriculture: 'Agri_15', service: 'Serv_15', industry: 'Indtota_15',
    residential: 'HH_15', transport: 'Trans_15', energy: 'Ener_15'
  },
  2020: {
    total: 'E2020', perCapita: 'Percapi_20', perGdp: 'CO2emis_20',
    agriculture: 'Agri_20', service: 'Serv_20', industry: 'Indtota_20',
    residential: 'HH_20', transport: 'Trans_20', energy: 'Ener_20'
  }
}

export const emissionDetailFieldMap = {
  2005: {
    '直接排放': 'Dir_05', '间接排放': 'Indir_05',
    '工业能源碳排': 'Indener_05', '工业过程碳排': 'Indproc_05', '工业总碳排': 'Indtota_05',
    '城镇生活碳排': 'Urbanho_05', '农村生活碳排': 'Ruralho_05', '生活总碳排': 'HH_05',
    '道路碳排': 'Road_05', '铁路碳排': 'Railway_05', '水运碳排': 'Waterna_05', '航空碳排': 'Avia_05', '交通总碳排': 'Trans_05'
  },
  2010: {
    '直接排放': 'Dir_10', '间接排放': 'Indir_10',
    '工业能源碳排': 'Indener_10', '工业过程碳排': 'Indproc_10', '工业总碳排': 'Indtota_10',
    '城镇生活碳排': 'Urbanho_10', '农村生活碳排': 'Ruralho_10', '生活总碳排': 'HH_10',
    '道路碳排': 'Road_10', '铁路碳排': 'Railway_10', '水运碳排': 'Waterna_10', '航空碳排': 'Avia_10', '交通总碳排': 'Trans_10'
  },
  2015: {
    '直接排放': 'Dir_15', '间接排放': 'Indir_15',
    '工业能源碳排': 'Indener_15', '工业过程碳排': 'Indproc_15', '工业总碳排': 'Indtota_15',
    '城镇生活碳排': 'Urbanho_15', '农村生活碳排': 'Ruralho_15', '生活总碳排': 'HH_15',
    '道路碳排': 'Road_15', '铁路碳排': 'Railway_15', '水运碳排': 'Waterna_15', '航空碳排': 'Avia_15', '交通总碳排': 'Trans_15'
  },
  2020: {
    '直接排放': 'Dir_20', '间接排放': 'Indir_20',
    '工业能源碳排': 'Indener_20', '工业过程碳排': 'Indproc_20', '工业总碳排': 'Indtota_20',
    '城镇生活碳排': 'Urbanho_20', '农村生活碳排': 'Ruralho_20', '生活总碳排': 'HH_20',
    '道路碳排': 'Road_20', '铁路碳排': 'Railway_20', '水运碳排': 'Waterna_20', '航空碳排': 'Avia_20', '交通总碳排': 'Trans_20'
  }
}

// 碳排放专题图色带（绿→黄→红 五级）
export const emissionColorRamp = [
  { quantity: 0,    color: '#1a9850', label: '低' },
  { quantity: 25,   color: '#a6d96a', label: '较低' },
  { quantity: 50,   color: '#ffffbf', label: '中' },
  { quantity: 75,   color: '#fdae61', label: '较高' },
  { quantity: 100,  color: '#d73027', label: '高' }
]

// 天地图 WMTS 底图配置
export const tdtBasemapConfig = {
  tileGrid: {
    origin: [-20037508.34, 20037508.34],
    resolutions: [
      156543.033928, 78271.516964, 39135.758482, 19567.879241,
      9783.9396205, 4891.96981025, 2445.98490513, 1222.99245256,
      611.496226281, 305.748113141, 152.87405657, 76.4370282852,
      38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782,
      2.38865713391, 1.19432856696, 0.597164283478
    ],
    matrixIds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
  },
  tk: '84228dbf628cdeeaed404b4310c6b4d8',
  sources: {
    road: {
      layer: 'vec',
      style: 'default',
      format: 'image/png',
      matrixSet: 'w',
      projection: 'EPSG:3857'
    },
    satellite: {
      layer: 'img',
      style: 'default',
      format: 'image/png',
      matrixSet: 'w',
      projection: 'EPSG:3857'
    }
  }
}

// 公交站矢量瓦片图层配置
export const busStopVtConfig = {
  baseUrl: 'http://localhost:8080/geoserver/gwc/service/wmts',
  params: {
    REQUEST: 'GetTile',
    SERVICE: 'WMTS',
    VERSION: '1.0.0',
    LAYER: 'cd_data:bus_stop',
    STYLE: '',
    TILEMATRIXSET: 'EPSG:900913',
    FORMAT: 'application/vnd.mapbox-vector-tile'
  }
}

export const examplePoint = {
  center: [116.4074, 39.9042],
  zoom: 10
}

export const basemapList = [
  { key: 'road', label: '路网' },
  { key: 'satellite', label: '卫星' },
  { key: 'hybrid', label: '混合' }
]

export const dataSourceList = [
  { key: 'local', label: '本地 GeoJSON' },
  { key: 'geoserver', label: 'GeoServer WFS' },
  { key: 'api', label: '业务 API' }
]

export const dataSourceMap = {
  local: {
    key: 'local',
    label: '本地 GeoJSON',
    serviceType: 'geojson',
    layerType: 'vector',
    enabled: true,
    searchable: true,
    filterable: true,
    queryable: true,
    request: {
      url: '/geo_data/chengdu_local.geojson',
      method: 'GET'
    },
    projection: {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  },
  geoserver: {
    key: 'geoserver',
    label: 'GeoServer WFS',
    serviceType: 'wfs',
    layerType: 'vector',
    enabled: true,
    searchable: true,
    filterable: true,
    queryable: true,
    request: {
      url: 'http://localhost:8080/geoserver/test_cd/wfs',
      method: 'GET',
      params: {
        service: 'WFS',
        version: '1.1.0',
        request: 'GetFeature',
        typeName: 'test_cd:chengdu_xian',
        outputFormat: 'application/json'
      }
    },
    projection: {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  },
  api: {
    key: 'api',
    label: '业务 API',
    serviceType: 'api',
    layerType: 'vector',
    enabled: true,
    searchable: true,
    filterable: true,
    queryable: true,
    request: {
      url: 'http://localhost:8081/api/geojson',
      method: 'GET'
    },
    projection: {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }
  },
  wmsDemo: {
    key: 'wmsDemo',
    label: '预留 WMS',
    serviceType: 'wms',
    layerType: 'image',
    enabled: false,
    searchable: false,
    filterable: false,
    queryable: true,
    request: {
      url: 'http://localhost:8080/geoserver/test_cd/wms',
      params: {
        LAYERS: 'test_cd:chengdu_xian',
        FORMAT: 'image/png',
        TRANSPARENT: true
      }
    }
  },
  wmtsDemo: {
    key: 'wmtsDemo',
    label: '预留 WMTS',
    serviceType: 'wmts',
    layerType: 'tile',
    enabled: false,
    searchable: false,
    filterable: false,
    queryable: false,
    request: {
      url: 'http://localhost:8080/geoserver/gwc/service/wmts'
    }
  },
  wcsDemo: {
    key: 'wcsDemo',
    label: '预留 WCS',
    serviceType: 'wcs',
    layerType: 'coverage',
    enabled: false,
    searchable: false,
    filterable: false,
    queryable: false,
    request: {
      url: 'http://localhost:8080/geoserver/test_cd/wcs'
    }
  }
}
