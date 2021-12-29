const request = require('supertest');
const app = require('../config/express');
const { FeatureAttribute, DataDateAttribute, NumberAttribute } = require('../dbSchemas/featureAttributeSchema');
const {
  casesAttrToDb,
  deathsAttrToDb,
  categoryStringAttr,
  bedOccupancyAttrToDb,
  hospitalStayAttrToDb,
  bedOccupancyWithoutDataDateAttrToDb,
} = require('../testUtils/testData/attributesData');

jest.mock('../config/config.js', () => {
  return {
    authorizeTokenAttribute: false,
  };
});

describe('GET /api/featureAttributes', () => {

  it('should return 500 when attributeIdCategories and attributeId are missing', async () => {
    await DataDateAttribute.insertMany([...bedOccupancyAttrToDb]);
    await request(app).get(`/api/featureAttributes?latestValues=true`).expect(500);
  });

  it('should return correct data structure', async () => {
    await DataDateAttribute.insertMany([...bedOccupancyAttrToDb]);
    const res = await request(app).get(`/api/featureAttributes?attributeId=Bed occupancy rate&latestValues=true`).expect(200);
    expect(Object.keys(res.body)).toHaveLength(1);
    expect(Object.keys(res.body)).toEqual([bedOccupancyAttrToDb[0].attributeId]);
    expect(Object.keys(res.body[bedOccupancyAttrToDb[0].attributeId][0]).includes('date')).toEqual(true);
    expect(Object.keys(res.body[bedOccupancyAttrToDb[0].attributeId][0]).includes('dataDate')).toEqual(true);
    expect(Object.keys(res.body[bedOccupancyAttrToDb[0].attributeId][0]).includes('featureId')).toEqual(true);
    expect(Object.keys(res.body[bedOccupancyAttrToDb[0].attributeId][0]).includes('attributeId')).toEqual(true);
    expect(Object.keys(res.body[bedOccupancyAttrToDb[0].attributeId][0]).includes('value')).toEqual(true);
  });

  it('should return one document for the last reported date for each geographic unit e.g. featureId', async () => {
    await DataDateAttribute.insertMany([bedOccupancyAttrToDb[0], bedOccupancyAttrToDb[1]]);
    const res = await request(app).get(`/api/featureAttributes?attributeId=Bed occupancy rate&latestValues=true`).expect(200);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId][0].date).toEqual(bedOccupancyAttrToDb[1].date);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId]).toHaveLength(1);
  });

  it('should return one document for the last reported date for one geographic unit e.g. featureId', async () => {
    await DataDateAttribute.insertMany([...bedOccupancyAttrToDb]);
    const res = await request(app)
      .get(`/api/featureAttributes?attributeId=Bed occupancy rate&featureId=District1&latestValues=true`)
      .expect(200);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId][0].date).toEqual(bedOccupancyAttrToDb[1].date);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId][0].featureId).toEqual(bedOccupancyAttrToDb[1].featureId);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId]).toHaveLength(1);
  });

  it('should return one document for the last reported date for each geographic unit e.g. featureId if reported period e.g. dataDate is missing', async () => {
    await NumberAttribute.insertMany([...bedOccupancyWithoutDataDateAttrToDb]);
    const res = await request(app).get(`/api/featureAttributes?attributeId=Bed occupancy rate&latestValues=true`).expect(200);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId][0].date).toEqual(bedOccupancyAttrToDb[1].date);
    expect(res.body[bedOccupancyAttrToDb[0].attributeId]).toHaveLength(1);
  });

  it('should return documents with the right attributeId from the query', async () => {
    await DataDateAttribute.insertMany([...bedOccupancyAttrToDb, ...hospitalStayAttrToDb]);
    const res = await request(app).get(`/api/featureAttributes?attributeId=Bed occupancy rate&latestValues=true`).expect(200);
    expect(Object.keys(res.body)).toEqual([bedOccupancyAttrToDb[0].attributeId]);
  });

  it('should return only attributes with correct start of attributeId', async () => {
    await FeatureAttribute.insertMany([...categoryStringAttr]);
    const res = await request(app).get(`/api/featureAttributes?attributeIdCategory=categorised`).expect(200);
    expect(Object.keys(res.body)).toHaveLength(1);
    expect(res.body[categoryStringAttr[0].attributeId]).toHaveLength(1);
  });

});

describe('GET api/featureAttributes/:attributeId/availableDates', () => {
  it('should return empty array when attributeId is an unknown string', async () => {
    const res = await request(app).get(`/api/featureAttributes/unknownAttributeId/availableDates`).expect(200);
    expect(res.body).toEqual([]);
  });

  it('should return array with dates ordered by date DESC when attributeId is in the database', async () => {
    await FeatureAttribute.insertMany(casesAttrToDb);
    const res = await request(app).get(`/api/featureAttributes/covid19Cases/availableDates`).expect(200);
    expect(res.body).toEqual([
      { dataDate: 'January 2021', date: '2021-02-09T00:00:00.000Z' },
      { dataDate: 'February 2021', date: '2021-02-10T00:00:00.000Z' },
      { dataDate: 'March 2021', date: '2021-02-11T00:00:00.000Z' },
      { dataDate: 'April 2021', date: '2021-02-12T00:00:00.000Z' },
      { dataDate: 'May 2021', date: '2021-02-13T00:00:00.000Z' },
    ]);
  });

  it('should return correct array with dates when different attributeIds are in the database', async () => {
    await FeatureAttribute.insertMany([...casesAttrToDb, ...deathsAttrToDb]);
    const res = await request(app).get(`/api/featureAttributes/covid19Cases/availableDates`).expect(200);
    expect(res.body).toEqual([
      { dataDate: 'January 2021', date: '2021-02-09T00:00:00.000Z' },
      { dataDate: 'February 2021', date: '2021-02-10T00:00:00.000Z' },
      { dataDate: 'March 2021', date: '2021-02-11T00:00:00.000Z' },
      { dataDate: 'April 2021', date: '2021-02-12T00:00:00.000Z' },
      { dataDate: 'May 2021', date: '2021-02-13T00:00:00.000Z' },
    ]);
  });

  it('should return each date only once when different featureIds with same dates are in the database', async () => {
    await FeatureAttribute.insertMany([...casesAttrToDb, { ...casesAttrToDb[0], featureId: 'Province2' }]);
    const res = await request(app).get(`/api/featureAttributes/covid19Cases/availableDates`).expect(200);
    expect(res.body).toEqual([
      { dataDate: 'January 2021', date: '2021-02-09T00:00:00.000Z' },
      { dataDate: 'February 2021', date: '2021-02-10T00:00:00.000Z' },
      { dataDate: 'March 2021', date: '2021-02-11T00:00:00.000Z' },
      { dataDate: 'April 2021', date: '2021-02-12T00:00:00.000Z' },
      { dataDate: 'May 2021', date: '2021-02-13T00:00:00.000Z' },
    ]);
  });

  it('should return null value for dataDate if it is not in the database', async () => {
    await FeatureAttribute.insertMany(bedOccupancyWithoutDataDateAttrToDb);
    const res = await request(app).get(`/api/featureAttributes/Bed occupancy rate/availableDates`).expect(200);
    expect(res.body).toEqual([
      { dataDate: null, date: '2021-03-28T00:00:0.000Z' },
      { dataDate: null, date: '2021-03-29T00:00:0.000Z' },
    ]);
  });
});

describe('GET /api/featureAttributes/:attributeId/uniqueFeatures', () => {
  it('should get empty array for wrong attributeId', async () => {
    await FeatureAttribute.insertMany(bedOccupancyAttrToDb);
    const res = await request(app).get(`/api/featureAttributes/wrongAttributeId/uniqueFeatures`).expect(200);
    expect(res.body).toEqual([]);
  });
  it('should get all values for attributeId in database', async () => {
    await FeatureAttribute.insertMany(bedOccupancyAttrToDb);
    const res = await request(app).get(`/api/featureAttributes/Bed occupancy rate/uniqueFeatures`).expect(200);
    expect(res.body).toEqual(['District1', 'District2']);
  });
});
