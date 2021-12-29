const mongoose = require('mongoose');
const { initializeDBConnection, disconnectFromDB, removeDB } = require('../db');
const { FEATURE_ATTRIBUTES_COLLECTION_NAME } = require('../dbSchemas/featureAttributeSchema');
const { POINT_ATTRIBUTES_COLLECTION } = require('../dbSchemas/pointAttributeSchema')

// the default jest timeout is 5s which is sometimes not enough to initialize DB connection
const TIMEOUT = 30000;

beforeAll(async () => {
  await initializeDBConnection();
  await mongoose.connection.db.collection(FEATURE_ATTRIBUTES_COLLECTION_NAME).createIndex({ date: -1, featureId: 1, attributeId: 1 });
  await mongoose.connection.db.collection(POINT_ATTRIBUTES_COLLECTION).createIndex({ geometry: '2dsphere' });
}, TIMEOUT);

afterAll(async () => {
  // await removeDB();
  await disconnectFromDB();
});

beforeEach(() => removeDB());

afterEach(() => removeDB());
