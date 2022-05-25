import mongoose from 'mongoose';

const MetadataSchema = new mongoose.Schema(
  {
    description: String,
    sourceWebsite: String,
    sourceOrganisation: String,
    updateDate: String,
    updateFrequency: String,
    unit: String,
    reliabilityScore: String,
    dataRetrievalDescription: String,
    dataCalculationDescription: String,
  },
  { _id: false },
);
export default MetadataSchema;
