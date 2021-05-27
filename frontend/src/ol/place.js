import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';

export const selectedPlaceVectorSource = new VectorSource();

export const selectedPlaceLayer = new VectorLayer({
  title: 'Selected Place',
  source: selectedPlaceVectorSource,
  style: [
    new Style({
      image: new Icon({
        src: './location.png',
      }),
    }),
  ],
});
