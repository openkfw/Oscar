import { GeoPackageAPI } from '@ngageoint/geopackage';
// import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { getGeoData } from '../../../axiosRequests';

let geojson;
const loadByteArray = async (array, callback) => {
  const geoPackage = await GeoPackageAPI.open(array);
  const featureTableNames = await geoPackage.getFeatureTables();
  featureTableNames.forEach((featureTableName) => {
    const featureDao = geoPackage.getFeatureDao(featureTableName);
    geojson = {
      type: 'FeatureCollection',
      features: [],
    };
    const iterator = featureDao.queryForGeoJSONIndexedFeaturesWithBoundingBox(undefined, true);
    // eslint-disable-next-line no-restricted-syntax
    for (const feature of iterator) {
      feature.type = 'Feature';
      geojson.features.push(feature);
    }
  });
};

const gpkgSourceLoader = (layerData, handleIsLoading) => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    // eslint-disable-next-line no-unused-vars
    loader: async (extent, resolution, projection) => {
      handleIsLoading({ title: layerData.title, type: 'geometry' }, 'add');
      const url = layerData.geoDataUrl;

      let response;

      if (url) {
        response = await getGeoData(url, { responseType: 'arraybuffer' });
        const array = new Uint8Array(response);
        loadByteArray(array);
      } else {
        response = [];
      }

      const newFeatures = vectorSource.getFormat().readFeatures(geojson, { featureProjection: projection });
      vectorSource.addFeatures(newFeatures);

      handleIsLoading(layerData.title, 'remove');
    },
  });
  return vectorSource;
};

export default gpkgSourceLoader;
