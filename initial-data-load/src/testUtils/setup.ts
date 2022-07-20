import { initializeDBConnection, disconnectFromDB, removeDB } from '../database/mongoDb/index';

// the default jest timeout is 5s which is sometimes not enough to initialize DB connection
const TIMEOUT = 30000;

beforeAll(async () => {
  await initializeDBConnection();
}, TIMEOUT);

afterAll(async () => {
  await removeDB();
  await disconnectFromDB();
});

beforeEach(async () => {
  await removeDB();
});

afterEach(async () => {
  await removeDB();
});
