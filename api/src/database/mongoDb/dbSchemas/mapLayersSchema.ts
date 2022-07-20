import mongoose from 'mongoose';
import { LAYER_TYPES } from './constants';
import MetadataSchema from './metadataSchema';

export const AttributeDescriptionSchema = new mongoose.Schema(
  {
    descriptionText: String,
    featureText: String,
    noDataMessage: String,
    dateText: String,
  },
  { _id: false },
);

export const AttributeDataSchema = new mongoose.Schema({
  attributeId: String,
  availableDatesSource: String,
});

export const StyleSchema = new mongoose.Schema(
  {
    fillColors: {
      equal: String,
      min: Number,
      max: Number,
      type: String,
      value: String,
    },
    fillColor: mongoose.Schema.Types.Mixed,
    min: Number,
    max: Number,
    strokeColor: mongoose.Schema.Types.Mixed,
    strokeWidth: Number,
    missingValueColor: String,
    clusterFillColor: String,
    clusterStrokeColor: String,
    strokeDecorations: [
      {
        type: String,
        enum: ['lineDash', 'widthByAttribute'],
      },
    ],
  },
  { _id: false },
);

export const LegendSchema = new mongoose.Schema(
  {
    type: String,
    color: String,
    description: String,
    min: Number,
    max: Number,
  },
  { _id: false },
);

export const LayerOptionsSchema = new mongoose.Schema(
  {
    boxReload: Boolean,
    maxResolution: Number,
    singleDisplay: Boolean,
    timeseries: Boolean,
  },
  { _id: false },
);

export const LayerSchema = new mongoose.Schema(
  {
      geoReferenceId: String,
      layerType: String,
      title: String,
      attribute: String,
      attributeDescription: {
        descriptionText: String,
        featureText: String,
        dateText: String,
        noDataMessage: String,
      }
  },
  { _id: false },
)

export const OneMapLayerData = new mongoose.Schema(
  {
    layerType: {
      type: String,
      enum: ['points', 'regions', 'geometry'],
    },
    geoReferenceId: String,
    title: String,
    attribute: String,
    attributeDescription: AttributeDescriptionSchema,
    attributeData: AttributeDataSchema,
    featureId: String,
    style: StyleSchema,
    legend: [LegendSchema],
    tileDataUrl: String,
    tileAttributions: String,
  },
  { _id: false },
);

export const MapLayerSchema = new mongoose.Schema({
  referenceId: { type: String, index: { unique: true } },
  geoReferenceId: String,
  layerType: String,
  category: {
    type: String,
    enum: ['Baseline data', 'Health facilities', 'Covid-19'],
  },
  attributeData: {
    attributeId: String,
    availableDatesSource: String,
  },
  title: String,
  attributeDescription: AttributeDescriptionSchema,
  attributeTemplateName: String,
  featureId: String,
  metadata: MetadataSchema,
  timeseries: Boolean,
  layers: [LayerSchema],
  layerOptions: LayerOptionsSchema,
  style: mongoose.Schema.Types.Mixed,
  tileDataUrl: String,
  tileAttributions: String,
});

export const MapLayer = mongoose.model('MapLayer', MapLayerSchema, 'mapLayers');

export const SingleMapLayer = MapLayer.discriminator(
  'SingleMapLayer',
  new mongoose.Schema({
    layerType: {
      type: String,
      enum: LAYER_TYPES,
    },
    style: StyleSchema,
    legend: [LegendSchema],
  }),
);

export const GroupMapLayer = MapLayer.discriminator(
  'GroupMapLayer',
  new mongoose.Schema({
    layerType: {
      type: String,
      enum: ['group'],
    },
    layers: [OneMapLayerData],
  }),
);

export const MAP_LAYER_COLLECTION_NAME = 'mapLayers';

export default {
  MapLayer,
  SingleMapLayer,
  GroupMapLayer,
  MAP_LAYER_COLLECTION_NAME,
};
