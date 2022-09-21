import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import { defaults as defaultControls } from 'ol/control';

import { defaults as defaultInteractions } from 'ol/interaction';

import { PublicMapConsumer, PublicMapProvider } from '../../contexts';
import { dataLayersTypes } from '../../constants';
import { selectedPlaceLayer } from '../../ol/place';
import PointInfo from '../../ol/info/PointInfoContainer';

import ShowPlaceLayer from '../../ol/ShowPlaceLayer';

import mapLayerOptions from '../../ol/dataLayers/mapLayers';
import { getDataLayersData } from '../../axiosRequests';
import dataLayerGenerator from '../../ol/dataLayers/dataLayerGenerator';
import AzureMapSearch from './AzureMapSearch';
import ActionButtons from './MapButtons/ActionButtons';
import Sidebar from './Sidebar/SidebarContainer';

import Legend from './Legend/LegendContainer';
import TimeSeries from './TimeSeriesSlider/TimeSeriesContainer';

// css
import '../../index.css';

const PublicMap = ({ isLoading, handleIsLoading, mapConfig }) => {
  const [mapLayers, setMapLayers] = useState(mapLayerOptions);
  const [dataLayers, setDataLayers] = useState([]);
  const [dataLayersData, setDataLayersData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [basicLayers, setBasicLayers] = useState([
    new LayerGroup({
      title: 'maps',
      layers: mapLayers,
    }),
    selectedPlaceLayer,
  ]);
  const [legends, setLegends] = useState([]);
  const [timeSeriesLayer, setTimeSeriesLayer] = useState(undefined);
  const [mapPosition, setMapPosition] = useState(null);

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
        center: mapPosition ? mapPosition.center : [mapConfig.x, mapConfig.y],
        zoom: mapPosition ? mapPosition.zoom : mapConfig.zoom,
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

  const setLayerSourceProp = (layer, key, value) => {
    if (layer) {
      layer.getSource().set(key, value);
      layer.getSource().refresh();
    }
  };

  const setupTimeseriesLayer = (layer) => {
    setTimeSeriesLayer(layer);
    if (layer) {
      layer.getSource().unset('sliderDate');
      layer.getSource().refresh();
    }
  };

  const toggleDataLayer = async (title) => {
    const dataLayersGroup = map
      .getLayers()
      .getArray()
      .find((layer) => layer instanceof LayerGroup && layer.get('title') === 'dataLayers');
    const dataLayers = dataLayersGroup.getLayers().getArray();
    const modifiedLayer = dataLayers.find((layer) => layer.get('title') === title);
    if (modifiedLayer) {
      // layer with the title found
      if (modifiedLayer.getVisible()) {
        // layer is selected, deselecting
        modifiedLayer.setVisible(false);
        // if any of the layers that are still visible on the map have time series, show slider for one of them
        const timeseriesLayer = dataLayers.find(
          (layer) =>
            layer.get('title') !== title &&
            layer.get('layerOptions') &&
            !layer.get('layerOptions').singleDisplay &&
            layer.get('layerOptions').timeseries &&
            layer.getVisible(),
        );
        if (timeseriesLayer) {
          setupTimeseriesLayer(timeseriesLayer);
        } else if (modifiedLayer.get('layerOptions') && modifiedLayer.get('layerOptions').timeseries) {
          setupTimeseriesLayer(undefined);
        }
      } else {
        // layer is not selected, selecting
        if (modifiedLayer.get('type') === dataLayersTypes.REGIONS) {
          const MLlayerOptions = modifiedLayer.get('layerOptions') || {};
          // deselect the rest of regions layers, if regions layer with singleDisplay true is selected
          if (MLlayerOptions.singleDisplay) {
            dataLayers.forEach((layer) => {
              if (layer.get('type') === dataLayersTypes.REGIONS && layer.get('title') !== title) {
                const layerLayerOptions = layer.get('layerOptions') || {};
                if (!timeSeriesLayer && layerLayerOptions.timeseries && layer.getVisible()) {
                  setTimeSeriesLayer(undefined);
                }
                layer.setVisible(false);
              }
            });
          } else {
            // deselect regions layer, which has singleDisplay true, if regions layer with singleDisplay false is selected
            const singleDisplayLayerIndex = dataLayers.findIndex(
              (layer) =>
                layer.get('type') === dataLayersTypes.REGIONS &&
                layer.get('title') !== title &&
                layer.get('layerOptions') &&
                layer.get('layerOptions').singleDisplay &&
                layer.getVisible(),
            );
            const singleDisplayLayer = dataLayers[singleDisplayLayerIndex];
            if (singleDisplayLayer) {
              if (singleDisplayLayer.get('layerOptions').timeseries) {
                setTimeSeriesLayer(undefined);
              }
              singleDisplayLayer.setVisible(false);
            }
          }
        }
        // select correct layer and timeline, if timeseries data available
        const layerOptions = modifiedLayer.get('layerOptions');
        if ((!timeSeriesLayer && layerOptions && layerOptions.timeseries) || modifiedLayer.timeseries) {
          setupTimeseriesLayer(modifiedLayer);
        }
        modifiedLayer.setVisible(true);
      }
    }

    const legends = extractLegends(dataLayers);
    setLegends(legends);
    setDataLayers([...dataLayers]);
  };

  // initiate map & listeners
  useEffect(() => {
    const mapInitiation = async () => {
      map.setTarget('map');

      // Listen to map changes
      map.on('moveend', async () => {
        const center = map.getView().getCenter();
        const zoom = map.getView().getZoom();
        setMapPosition({ center, zoom });
        const hash = `#map=${map.getView().getZoom()}/${Math.round(map.getView().getCenter()[0] * 100) / 100}/${
          Math.round(map.getView().getCenter()[1] * 100) / 100
        }/${map.getView().getRotation()}`;
        window.location = hash;
      });

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
    const dataLayersFetching = async () => {
      const dataLayersData = await getDataLayersData();
      if (dataLayersData.length) {
        const generatedLayers = dataLayersData.map((layerData) => {
          return dataLayerGenerator(layerData, handleIsLoading);
        });

        map.addLayer(
          new LayerGroup({
            title: 'dataLayers',
            layers: generatedLayers,
          }),
        );
        setDataLayers(generatedLayers);
        setDataLayersData(dataLayersData);
      }
    };
    dataLayersFetching();
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
      {timeSeriesLayer && (
        <TimeSeries
          layer={timeSeriesLayer}
          updateLayerFnc={(key, value) => setLayerSourceProp(timeSeriesLayer, key, value)}
        />
      )}
      <Sidebar
        isLoading={isLoading}
        mapLayers={mapLayers}
        layers={dataLayers}
        dataLayersData={dataLayersData}
        map={map}
        switchMapLayers={switchMapLayers}
        toggleDataLayer={toggleDataLayer}
      />
    </div>
  );
};

PublicMap.propTypes = {
  isLoading: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleIsLoading: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  mapConfig: PropTypes.object,
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
