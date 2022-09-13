import mongoose from 'mongoose';
import { filterCoordinates, filterProperties } from '../filters';

const getGeoData = async (tableName: string, bottomLeft: string, topRight: string, properties: object) => {
  const { connection } = mongoose;
  const { db } = connection;

  let filter = {};
  if (bottomLeft && topRight) {
    filter = { bbox: filterCoordinates(filter, bottomLeft, topRight) };
  }
  if (Object.keys(properties).length) {
    filter = filterProperties(filter, properties);
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

const getCoordinatesFromPointsCollection = async (collectionName: string, bottomLeft: string, topRight: string) => {
  let coordinateFilter = {};
  if (bottomLeft && topRight) {
    coordinateFilter = { bbox: filterCoordinates(coordinateFilter, bottomLeft, topRight) };
  }

  const { connection } = mongoose;
  const { db } = connection;

  const data = await db.collection(collectionName).find(coordinateFilter).toArray();
  return data.map((item) => item.geometry.coordinates);
};

export default {
  getGeoData,
  getProperty,
  getUniqueValuesForProperty,
  getPropertySum,
  getCoordinatesFromPointsCollection,
};