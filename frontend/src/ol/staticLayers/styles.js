/* eslint-disable no-restricted-properties */
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';

import colormap from 'colormap';
import { staticLayerColorTypes } from '../../constants';
import { isNotDefinedIncl0 } from '../../utils/helpers';

// Styling based on feature attributes - trying generic
export const colormaps = {
  blue: colormap({
    colormap: 'freesurface-blue',
    nshades: 50,
    format: 'rgbaString',
    alpha: 0.5,
  }),
  green: colormap({
    colormap: 'chlorophyll',
    nshades: 50,
    format: 'rgbaString',
    alpha: 0.8,
  }),
  red: colormap({
    colormap: 'inferno',
    nshades: 50,
    format: 'rgbaString',
    alpha: 0.7,
  }),
  hot: colormap({
    colormap: 'hot',
    nshades: 50,
    format: 'rgbaString',
    alpha: 0.7,
  }),
};

const getColorFromLayerStyle = (value, colorStyle, min, max) => {
  if (colorStyle.hasOwnProperty('value') && colorStyle.hasOwnProperty('type')) {
    // only one color object
    if (colorStyle.type === staticLayerColorTypes.COLOR) {
      return colorStyle.value;
    }
    if (colorStyle.type === staticLayerColorTypes.COLORMAP) {
      let colorMap;
      if (colormaps.hasOwnProperty(colorStyle.value)) {
        colorMap = colormaps[colorStyle.value];
      } else {
        colorMap = colormaps.blue;
      }
      // min = index-50, max = index-1
      const numericalValue = parseFloat(value);

      // "1 - value" to switch the colour scale, otherwise colours dont make sense
      const f = 1 - Math.pow(Math.max(0, Math.min((numericalValue - min) / (max - min), 1)), 0.5);
      const index = Math.round(f * (50 - 1));
      return colorMap[index];
    }
  } else {
    // different styles dependent on value
    if (typeof value === 'string' && colorStyle.hasOwnProperty(value.toUpperCase())) {
      // value has defined style
      return colorStyle[value.toUpperCase()].value;
    }
    if (typeof value === 'string' && Array.isArray(colorStyle)) {
      const colorValue = colorStyle.find(({ equal }) => equal === value.toUpperCase());
      if (colorValue && colorValue.value) {
        return colorValue.value;
      }
    }
    if (colorStyle.default) {
      return colorStyle.default.value;
    }
  }
};

export const regionStyleFactory = (attribute, layerStyle) => {
  return (feature) => {
    let fillColor;
    const value = feature.get(attribute);
    if (isNotDefinedIncl0(value)) {
      fillColor = layerStyle.missingValueColor || 'rgb(128,128,128, 0.5)';
    } else if (layerStyle.fillColor) {
      fillColor = getColorFromLayerStyle(value, layerStyle.fillColor, layerStyle.min, layerStyle.max);
    } else if (layerStyle.fillColors) {
      fillColor = getColorFromLayerStyle(value, layerStyle.fillColors);
    }
    return new Style({
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({ color: layerStyle.strokeColor.value || 'rgba(255,255,255,0.5)' }),
    });
  };
};

export const pointStyleFactory = (attribute, layerStyle) => {
  return (feature) => {
    const size = feature.get('features').length;
    if (size === 1) {
      const singleFeature = feature.get('features')[0];
      const value = singleFeature.get(attribute);
      let fillColor;
      if (layerStyle.fillColor) {
        fillColor = getColorFromLayerStyle(value, layerStyle.fillColor) || 'green';
      } else if (layerStyle.fillColors) {
        const evaluatingProperty = layerStyle.property || attribute;
        fillColor = getColorFromLayerStyle(singleFeature.get(evaluatingProperty), layerStyle.fillColors) || 'green';
      }
      // one feature
      return new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({
            color: fillColor,
          }),
          stroke: new Stroke({
            color: getColorFromLayerStyle(value, layerStyle.strokeColor) || 'rgba(0, 102, 0, 0.2)',
            width: 2,
          }),
        }),
      });
    } // cluster with multiple features
    return new Style({
      image: new CircleStyle({
        radius: 15,
        fill: new Fill({
          color: layerStyle.clusterFillColor || 'rgba(0, 0, 0, 0.7)',
        }),
        stroke: new Stroke({ color: layerStyle.clusterStrokeColor || 'gray', width: 2 }),
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: '#fff',
        }),
      }),
    });
  };
};

export const geometryStyleFactory = (attribute, layerStyle) => {
  return (feature) => {
    const strokeParameters = {};
    const value = feature.get(attribute);
    strokeParameters.color =
      getColorFromLayerStyle(value, layerStyle.strokeColor, layerStyle.min, layerStyle.max) || 'green';
    if (layerStyle.strokeDecorations.includes('lineDash')) {
      strokeParameters.lineDash = [4];
    } else {
      strokeParameters.width = 2;
    }
    let fillStyle;
    if (layerStyle.fillColor) {
      fillStyle = new Fill({
        color: getColorFromLayerStyle(value, layerStyle.fillColor, layerStyle.min, layerStyle.max),
      });
    }
    return new Style({
      stroke: new Stroke(strokeParameters),
      fill: fillStyle,
    });
  };
};

export const combinedStyleFactory = (attribute, layerStyle) => {
  return (feature) => {
    const strokeParameters = {};
    const value = feature.get(attribute);
    strokeParameters.color =
      getColorFromLayerStyle(value, layerStyle.strokeColor, layerStyle.min, layerStyle.max) || 'blue';
    if (layerStyle.strokeDecorations.includes('lineDash')) {
      strokeParameters.lineDash = [4];
    }
    strokeParameters.width = 2;
    let fillStyle;
    if (layerStyle.fillColor) {
      fillStyle = new Fill({
        color: getColorFromLayerStyle(value, layerStyle.fillColor, layerStyle.min, layerStyle.max),
      });
    }
    return new Style({
      stroke: new Stroke(strokeParameters),
      fill: fillStyle,
    });
  };
};
