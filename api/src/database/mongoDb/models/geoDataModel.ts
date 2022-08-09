import mongoose from 'mongoose';
import { filterCoordinates } from '../filters';

const getGeoData = async (tableName: string, bottomLeft: string, topRight: string) => {
  const { connection } = mongoose;
  const { db } = connection;

  let filter = {};
  if (bottomLeft && topRight) {
    filter = { bbox: filterCoordinates(filter, bottomLeft, topRight) };
  }

  const features = await db
    .collection(tableName)
    .aggregate([
      { $match: filter },
      {
        $project: {
          _id: 0,
          id: '$_id',
          type: 1,
          properties: 1,
          geometry: 1,
        },
      },
    ])
    .toArray();
  return features;
};

const getProperty = async (tableName: string, propertyName: string) => {
  const { connection } = mongoose;
  const { db } = connection;

  const data = await db
    .collection(tableName)
    .aggregate([{ $project: { _id: 0, id: `$_id`, value: `$properties.${propertyName}` } }])
    .toArray();
  return data;
};

const getUniqueValuesForProperty = async (tableName: string, propertyName: string) => {
  const { connection } = mongoose;
  const { db } = connection;

  const data = await db
    .collection(tableName)
    .aggregate([{ $group: { _id: `$properties.${propertyName}` } }])
    .toArray();
  return data.map((item) => item._id);
};

const getPropertySum = async (tableName: string, propertyName: string) => {
  const { connection } = mongoose;
  const { db } = connection;

  const data = await db
    .collection(tableName)
    .aggregate([{ $group: { _id: null, value: { $sum: `$properties.${propertyName}` } } }])
    .toArray();
  return data;
};

export default { getGeoData, getProperty, getUniqueValuesForProperty, getPropertySum };
