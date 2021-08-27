const mongoose = require('mongoose');

const POINT_ATTRIBUTES_COLLECTION = 'point_attributes';

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: ['Number'],
      required: true,
    },
  },
  { _id: false },
);

const pointAttributeSchema = new mongoose.Schema({
  geometry: {
    type: pointSchema,
    ref: 'geometry',
    required: true,
  },
  properties: {
    attributeId: String,
    date: String,
    updatedDate: String,

    _keys: mongoose.Schema.Types.Mixed,
  },
});

const PointAttribute = mongoose.model('PointAttribute', pointAttributeSchema);

module.exports = {
  POINT_ATTRIBUTES_COLLECTION,
  PointAttribute,
};
