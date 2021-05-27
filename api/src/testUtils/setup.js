const mongoose = require('mongoose');
const { initializeDBConnection, disconnectFromDB, removeDB } = require('../db');

// the default jest timeout is 5s which is sometimes not enough to initialize DB connection
const TIMEOUT = 30000;

beforeAll(async () => {
  await initializeDBConnection();
  await mongoose.connection.db.collection('attributes').createIndex({ date: -1, featureId: 1, attributeId: 1 });
}, TIMEOUT);

afterAll(async () => {
  // await removeDB();
  await disconnectFromDB();
});

beforeEach(() => removeDB());

afterEach(() => removeDB());
