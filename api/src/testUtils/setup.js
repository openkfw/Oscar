const mongoose = require('mongoose');
const { initializeDBConnection, disconnectFromDB, removeDB } = require('../database/mongoDb/index');

// the default jest timeout is 5s which is sometimes not enough to initialize DB connection
const TIMEOUT = 30000;

beforeAll(async () => {
  await initializeDBConnection();
  await mongoose.connection.db.collection('attributes').createIndex({ date: -1, featureId: 1, attributeId: 1 });
  await mongoose.connection.db.collection('pointAttributes').createIndex({ geometry: '2dsphere' });
}, TIMEOUT);

afterAll(async () => {
  // await removeDB();
  await disconnectFromDB();
});

beforeEach(() => removeDB());

afterEach(() => removeDB());
