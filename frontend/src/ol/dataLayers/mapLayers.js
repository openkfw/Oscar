import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

/*
            Tileset ID specifies which data layers to render in the tiles. Can be:

            'microsoft.base.road',
            'microsoft.base.darkgrey',
            'microsoft.imagery',
            'microsoft.weather.infrared.main',
            'microsoft.weather.radar.main',
            'microsoft.base.hybrid.road',
            'microsoft.base.labels.road'
        */
const tilesetId = 'microsoft.base.road';

// The language of labels. Supported languages: https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages
const language = 'en-US';

// The regional view of the map. Supported views: https://aka.ms/AzureMapsLocalizationViews
const view = 'Auto';

const mapLayers = [
  new TileLayer({
    title: 'Open Street Maps',
    source: new OSM({
      // No latin tiles until the black protest tiles are gone
      url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
      cacheSize: 8192,
    }),
    visible: true,
  }),
  new TileLayer({
    title: 'Azure Maps',
    visible: false,
    source: new XYZ({
      url: `/MAP?&tilesetId=${tilesetId}&zoom={z}&x={x}&y={y}&tileSize=256&language=${language}&view=${view}`,
      attributions: `© ${new Date().getFullYear()} TomTom, Microsoft`,
    }),
  }),
  new TileLayer({
    title: 'Here satellite Maps',
    visible: false,
    source: new XYZ({
      url: `/SATELLITE/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg`,
      attributions: `© ${new Date().getFullYear()} HERE`,
    }),
  }),
  new TileLayer({
    title: 'Carto Positron',
    visible: false,
    source: new XYZ({
      url: `https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png`,
      cacheSize: 8192,
    }),
  }),
];
export default mapLayers;
