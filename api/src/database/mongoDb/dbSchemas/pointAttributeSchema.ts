import mongoose from 'mongoose';

export const POINT_ATTRIBUTES_COLLECTION = 'pointAttributes';

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
    createdDate: String,
    updatedDate: String,

    _keys: mongoose.Schema.Types.Mixed,
  },
});

const PointAttribute = mongoose.model('PointAttribute', pointAttributeSchema);

export default PointAttribute;
