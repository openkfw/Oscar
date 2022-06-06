import mongoose from 'mongoose';

jest.mock('azure-storage');

describe('Layer attributes', () => {
  it('should save nothing, if data for dataset not found', async () => {
    jest.mock('../config/config.ts', () => {
      return {
        mongoUri: 'qwertyuiop',
        uploadDataTypes: 'attributes',
        dataset: 'testCountry2',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads.default();

    const inDb = await mongoose.connection.db.collection('attributes').find({}).toArray();
    expect(inDb).toHaveLength(0);
  });

  it('should upload data with correct date', async () => {
    jest.mock('../config/config.ts', () => {
      return {
        mongoUri: 'qwertyuiop',
        uploadDataTypes: 'attributes',
        dataset: 'testCountry',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });

    await uploads.default();

    const inDb = await mongoose.connection.db.collection('attributes').find({}).toArray();
    expect(inDb).toHaveLength(7);
    expect(inDb[0].attributeId).toEqual('Sample Attribute');
    expect(inDb[0].featureId).toEqual('Province 1');
    expect(inDb[0].valueNumber).toEqual(1);
    expect(inDb[2].featureId).toEqual('Province 3');
    expect(inDb[2].valueString).toEqual('Three');
    expect(inDb[4].featureId).toEqual('Province 5');
    expect(inDb[4].valueNumber).toEqual(5.5);
  });
});
