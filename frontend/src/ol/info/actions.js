import { fromJS } from 'immutable';
import { roundNumber, isNotDefinedIncl0 } from '../../helpers';

export const PIXEL_DETAILS = 'PIXEL_DETAILS';
export const SET_PIXEL_COORDINATES = 'SET_PIXEL_COORDINATES';
export const CLEAR_PIXEL_DETAILS = 'CLEAR_PIXEL_DETAILS';

export const actions = {};

const featureToDetails = (feature, layerTitle, attributeDescription, featureId) => {
  if (attributeDescription) {
    if (!attributeDescription.descriptionText) {
      return;
    }
    if (attributeDescription && attributeDescription.descriptionText) {
      const properties = feature.getProperties() || {};
      // look for property in feature
      const propertiesMatch = [...attributeDescription.descriptionText.matchAll(/{{[^{}]*}}/g)];
      const propertiesNames = propertiesMatch.map((match) => match[0].slice(2, match.length - 3));
      const propertyMissing = propertiesNames.map((name) => isNotDefinedIncl0(properties[name])).includes(true);
      if (propertyMissing) {
        return attributeDescription.noDataMessage || `Data from layer ${layerTitle} is missing`;
      }
      // replace placeholder variable for object with properties from feature
      let replacedAttributeDescription = attributeDescription.descriptionText.replaceAll(
        /{{[^{}]*}}/g,
        // eslint-disable-next-line func-names
        function (match) {
          const propertyName = match.slice(2, match.length - 2);
          if (properties && !isNotDefinedIncl0(properties[propertyName])) {
            if (typeof properties[propertyName] === 'number') {
              return roundNumber(properties[propertyName]);
            }
            return properties[propertyName];
          }
          return '';
        },
      );
      if (attributeDescription.dateText && properties.dataDate) {
        const replacedDataText = attributeDescription.dateText.replaceAll(/{{dataDate}}/g, properties.dataDate);
        replacedAttributeDescription += `<br/> ${replacedDataText}`;
      } else if (attributeDescription.dateText && properties.updatedDate) {
        const replacedDataText = attributeDescription.dateText.replaceAll(/{{updatedDate}}/g, properties.updatedDate);
        replacedAttributeDescription += `<br/> ${replacedDataText}`;
      } else if (properties.date) {
        replacedAttributeDescription += `<br/> Reporting date: ${properties.date}`;
      }
      if (featureId && properties[featureId]) {
        // specific text for geographical information
        if (attributeDescription.featureText) {
          const replacedFeatureText = attributeDescription.featureText.replaceAll(
            /{{featureId}}/g,
            properties[featureId],
          );
          replacedAttributeDescription += `<br/>   ${replacedFeatureText}`;
        } else {
          replacedAttributeDescription += `<br/>   In ${properties[featureId]}`;
        }
      }
      return replacedAttributeDescription;
    }
  }
};

const getDetailsFromFeatures = (features) => {
  const texts = [];
  features.forEach((data) => {
    // features in clusters
    if (data.feature.getProperties().features && data.feature.getProperties().features.length > 0) {
      data.feature.getProperties().features.forEach((feature) => {
        texts.push(featureToDetails(feature, data.layer, data.attributeDescription, data.featureId));
      });
    } else {
      texts.push(featureToDetails(data.feature, data.layer, data.attributeDescription, data.featureId));
    }
  });
  // featureToDetails can return undefined, filtering out
  return texts.filter((txt) => txt);
};

actions.setPixelDetails = (features, coordinates, pixel) => (dispatch) => {
  dispatch(actions.featuresOnPixel(features));
  dispatch(actions.setPixelCoordinates(pixel, coordinates));
};

actions.featuresOnPixel = (features) => {
  const descriptions = getDetailsFromFeatures(features);
  return {
    type: PIXEL_DETAILS,
    payload: {
      descriptions,
    },
  };
};

actions.setPixelCoordinates = (pixel, coordinates) => ({
  type: SET_PIXEL_COORDINATES,
  payload: { pixel, coordinates },
});

actions.clearPixelDetails = () => ({
  type: CLEAR_PIXEL_DETAILS,
});

const defState = fromJS({});
export const reducer = (state = defState, action) => {
  switch (action.type) {
    case PIXEL_DETAILS:
      return state.setIn(['descriptions'], fromJS(action.payload.descriptions));
    case SET_PIXEL_COORDINATES:
      // eslint-disable-next-line no-case-declarations
      const newState = state.setIn(['coordinates'], fromJS(action.payload.coordinates));
      return newState.setIn(['pixel'], fromJS(action.payload.pixel));
    case CLEAR_PIXEL_DETAILS:
      return defState;
    default:
      return state;
  }
};

export default { reducer, actions };
