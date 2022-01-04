import React, { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import { defaults as defaultControls } from 'ol/control';

import { defaults as defaultInteractions } from 'ol/interaction';

import { ConfigContext, PublicMapConsumer, PublicMapProvider } from '../../contexts';
import { staticLayersTypes } from '../../constants';
import { selectedPlaceLayer } from '../../ol/place';
import PointInfo from '../../ol/info/PointInfoContainer';

import ShowPlaceLayer from '../../ol/ShowPlaceLayer';

import mapLayerOptions from '../../ol/staticLayers/mapLayers';
import { getStaticLayersData, getAvailableDates } from '../../axiosRequests';
import staticLayerGenerator from '../../ol/staticLayers/staticLayerGenerator';
import AzureMapSearch from './AzureMapSearch';
import ActionButtons from './MapButtons/ActionButtons';
import Sidebar from './Sidebar/SidebarContainer';

import Legend from './Legend/LegendContainer';
import TimeSeriesSlider from './TimeSeriesSlider';

// Popup imports

// css
import '../../index.css';

const PublicMap = ({ isLoading, handleIsLoading }) => {
  const [mapLayers, setMapLayers] = useState(mapLayerOptions);
  // eslint-disable-next-line no-unused-vars
  const [staticLayers, setStaticLayers] = useState([]);
  const [staticLayersData, setStaticLayersData] = useState([]);
  const configContext = useContext(ConfigContext);
  const { config } = configContext;
  const mapConfig = config.map;

  // eslint-disable-next-line no-unused-vars
  const [basicLayers, setBasicLayers] = useState([
    new LayerGroup({
      title: 'maps',
      layers: mapLayers,
    }),
    selectedPlaceLayer,
  ]);
  const [legends, setLegends] = useState([]);
  const [timeSeriesSlider, setTimeSeriesSlider] = useState(false);
  const [availableDates, setAvailableDates] = useState(null);
  const [modifiedLayer, setModifiedLayer] = useState(null);
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    const getZoomAndCenter = () => {
      let zoom;
      let center;
      if (window.location !== '') {
        const hash = window.location.hash.replace('#map=', '');
        const parts = hash.split('/');
        if (parts.length === 4) {
          zoom = parseInt(parts[0], 10);
          center = [parseFloat(parts[1]), parseFloat(parts[2])];
        }
      }
      setMapPosition({
        center: center || [mapConfig.x, mapConfig.y],
        zoom: zoom || mapConfig.zoom,
      });
    };
    if (mapConfig) {
      getZoomAndCenter();
    }
  }, [mapConfig]);

  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(
    new Map({
      target: null,
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
      controls: defaultControls({
        attributionOptions: {
          collapsible: false,
        },
      }),
      layers: basicLayers,
      view: new View({
        center: mapPosition ? mapPosition.center : [],
        zoom: mapPosition ? mapPosition.zoom : null,
        minZoom: 2,
      }),
    }),
  );

  const switchMapLayers = (title) => {
    const mapLayersGroup = map
      .getLayers()
      .getArray()
      .find((layer) => layer instanceof LayerGroup && layer.get('title') === 'maps');
    const updatedMapLayers = mapLayersGroup.getLayers().getArray();
    updatedMapLayers.forEach((layer) => {
      if (layer.get('title') === title) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    });
    const newLayers = [...updatedMapLayers];
    setMapLayers(newLayers);
  };

  const extractLegends = (layers) => {
    const legends = [];
    layers
      .filter((layer) => layer.getVisible())
      .forEach((layer) => {
        let legendData;
        if (layer instanceof LayerGroup) {
          const groupLayers = layer.getLayers();
          const layersInGroupLegends = [];
          groupLayers.forEach((lyr) => layersInGroupLegends.push(lyr.get('legend')));
          legendData = layersInGroupLegends.flat().filter((item) => item);
        } else {
          legendData = layer.get('legend');
        }
        if (legendData && legendData.length) {
          legends.push({ layerTitle: layer.get('title'), legends: legendData });
        }
      });
    return legends;
  };

  const showTimeseriesSlider = (availableDates, layer) => {
    setAvailableDates(availableDates);
    setTimeSeriesSlider(true);
    setModifiedLayer(layer);
    layer.getSource().unset('sliderDate');
    layer.getSource().unset('dataDate');
    layer.getSource().refresh();
  };

  const toggleStaticLayer = async (title) => {
    const staticLayersGroup = map
      .getLayers()
      .getArray()
      .find((layer) => layer instanceof LayerGroup && layer.get('title') === 'staticLayers');
    const staticLayers = staticLayersGroup.getLayers().getArray();
    const modifiedLayer = staticLayers.find((layer) => layer.get('title') === title);
    if (modifiedLayer) {
      // layer with the title found
      if (modifiedLayer.getVisible()) {
        // layer is selected, deselecting
        modifiedLayer.setVisible(false);
        // if any of the layers that are still visible on the map have time series, show slider for one of them
        const timeseriesLayerIndex = staticLayers.findIndex(
          (layer) =>
            layer.get('title') !== title &&
            layer.get('layerOptions') &&
            !layer.get('layerOptions').singleDisplay &&
            layer.get('layerOptions').timeseries &&
            layer.getVisible(),
        );
        const timeseriesLayer = staticLayers[timeseriesLayerIndex];
        if (timeseriesLayer) {
          const availableDates = await getAvailableDates(timeseriesLayer.get('attribute'));
          if (availableDates && availableDates.length > 1) {
            showTimeseriesSlider(availableDates, timeseriesLayer);
          }
          // for last layer with time series that is being deselected, hide slider and clear modifiedLayer state
        } else if (modifiedLayer.get('layerOptions') && modifiedLayer.get('layerOptions').timeseries) {
          setTimeSeriesSlider(false);
          setModifiedLayer(null);
        }
      } else {
        // layer is not selected, selecting
        // deselect the rest of regions layers, if regions layer with singleDisplay true is selected
        if (modifiedLayer.get('type') === staticLayersTypes.REGIONS) {
          const MLlayerOptions = modifiedLayer.get('layerOptions') || {};
          if (MLlayerOptions.singleDisplay) {
            staticLayers.forEach((layer) => {
              if (layer.get('type') === staticLayersTypes.REGIONS && layer.get('title') !== title) {
                const layerLayerOptions = layer.get('layerOptions') || {};
                if (layerLayerOptions.timeseries && layer.getVisible()) {
                  setTimeSeriesSlider(false);
                }
                layer.setVisible(false);
              }
            });
          } else {
            // deselect regions layer, which have singleDisplay true, if regions layer with singleDisplay false is selected
            const singleDisplayLayerIndex = staticLayers.findIndex(
              (layer) =>
                layer.get('type') === staticLayersTypes.REGIONS &&
                layer.get('title') !== title &&
                layer.get('layerOptions') &&
                layer.get('layerOptions').singleDisplay &&
                layer.getVisible(),
            );
            const singleDisplayLayer = staticLayers[singleDisplayLayerIndex];
            if (singleDisplayLayer) {
              if (singleDisplayLayer.get('layerOptions').timeseries) {
                setTimeSeriesSlider(false);
              }
              singleDisplayLayer.setVisible(false);
            }
          }
        }

        // select correct layer and timeline, if timeseries data available
        const layerOptions = modifiedLayer.get('layerOptions');
        if ((layerOptions && layerOptions.timeseries) || modifiedLayer.timeseries) {
          const availableDates = await getAvailableDates(modifiedLayer.get('attribute'));
          if (availableDates && availableDates.length > 1) {
            showTimeseriesSlider(availableDates, modifiedLayer);
            modifiedLayer.setVisible(true);
          } else {
            modifiedLayer.setVisible(true);
          }
        } else {
          modifiedLayer.setVisible(true);
        }
      }
    }

    const legends = extractLegends(staticLayers);
    setLegends(legends);
    setStaticLayers([...staticLayers]);
  };

  const updateMap = useCallback(() => {
    if (!mapPosition) {
      return;
    }
    if (mapPosition) {
      if (Number.isNaN(parseFloat(mapPosition.center[0]))) {
        return;
      }
    }
    map.getView().setCenter(mapPosition.center);
    map.getView().setZoom(mapPosition.zoom);
    const hash = `#map=${map.getView().getZoom()}/${Math.round(map.getView().getCenter()[0] * 100) / 100}/${
      Math.round(map.getView().getCenter()[1] * 100) / 100
    }/${map.getView().getRotation()}`;
    window.location = hash;
  }, [map, mapPosition]);

  // update map when moved
  useEffect(() => {
    updateMap();
  }, [mapPosition, updateMap]);

  // initiate map & listeners
  useEffect(() => {
    const mapInitiation = async () => {
      map.setTarget('map');

      // Listen to map changes
      map.on('moveend', async () => {
        const center = map.getView().getCenter();
        const zoom = map.getView().getZoom();
        setMapPosition({ center, zoom });
        // await updateMap();
      });

      await updateMap();
      await map.updateSize();
      window.addEventListener('load', () => {
        // Hide the address bar!
        window.scrollTo(0, 1);
      });
    };
    mapInitiation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch data about static layers
  useEffect(() => {
    const staticLayersFetching = async () => {
      const staticLayersData = await getStaticLayersData();
      if (staticLayersData.length) {
        const generatedLayers = staticLayersData.map((layerData) => {
          return staticLayerGenerator(layerData, handleIsLoading);
        });

        map.addLayer(
          new LayerGroup({
            title: 'staticLayers',
            layers: generatedLayers,
          }),
        );
        setStaticLayers(generatedLayers);
        setStaticLayersData(staticLayersData);
      }
    };
    staticLayersFetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update effect
  useEffect(() => {
    window.addEventListener('load', () => {
      // Hide the address bar!
      window.scrollTo(0, 1);
    });
  });

  return (
    <div>
      <div id="map">
        <PointInfo map={map} />
      </div>
      <ShowPlaceLayer map={map} />
      <ActionButtons switchMapLayers={switchMapLayers} mapLayers={mapLayers} map={map} />
      <AzureMapSearch map={map} />
      <Legend data={legends} />
      {timeSeriesSlider && modifiedLayer ? (
        <TimeSeriesSlider availableDates={availableDates} modifiedLayer={modifiedLayer} />
      ) : null}
      <Sidebar
        isLoading={isLoading}
        mapLayers={mapLayers}
        layers={staticLayers}
        staticLayersData={staticLayersData}
        map={map}
        switchMapLayers={switchMapLayers}
        toggleStaticLayer={toggleStaticLayer}
      />
    </div>
  );
};

PublicMap.propTypes = {
  isLoading: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleIsLoading: PropTypes.func.isRequired,
};

const PublicMapWrapper = (props) => (
  <PublicMapProvider>
    <PublicMapConsumer>
      {({ isLoading, handleIsLoading }) => (
        <PublicMap isLoading={isLoading} handleIsLoading={handleIsLoading} {...props} />
      )}
    </PublicMapConsumer>
  </PublicMapProvider>
);

export default PublicMapWrapper;
