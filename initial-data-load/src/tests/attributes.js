const mongoose = require('mongoose');

jest.mock('azure-storage');

describe('Layer attributes', () => {
  it('should save nothing, if data for country not found', async () => {
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'attributes',
        country: 'testCountry2',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });

    await uploads();

    const inDb = await mongoose.connection.db.collection('attributes').find({}).toArray();
    expect(inDb).toHaveLength(0);
  });

  it('should upload data with correct date', async () => {
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'attributes',
        country: 'testCountry',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });

    await uploads();

    const inDb = await mongoose.connection.db.collection('attributes').find({}).toArray();
    expect(inDb).toHaveLength(7);
    expect(inDb[0].attributeId).toEqual('Example Attribute');
    expect(inDb[0].featureId).toEqual('Province 1');
    expect(inDb[0].valueNumber).toEqual(1);
    expect(inDb[2].featureId).toEqual('Province 3');
    expect(inDb[2].valueString).toEqual('Three');
    expect(inDb[4].featureId).toEqual('Province 5');
    expect(inDb[4].valueNumber).toEqual(5.5);
  });
});
