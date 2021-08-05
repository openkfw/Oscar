/**
 * Load data from file based on file format
 * @param  {Buffer} incomingBlob - blob which triggered the function and is processed
 * @returns {Array<ItemFromFile>} - array with data from file
 */
import { Context } from '@azure/functions';
import csv2json from 'csvtojson';
import { ItemFromFile } from '../types';

const fileLoader = async (incomingBlob: Buffer, context: Context): Promise<Array<ItemFromFile>> => {
  let returnJson;
  const stringFromBuffer = incomingBlob.toString('utf8');
  await csv2json()
    .fromString(stringFromBuffer)
    .then((jsonArrayObj) => {
      returnJson = jsonArrayObj;
    });
  if (!returnJson) {
    context.log('Failed to convert csv file to JSON');
    return;
  }
  return returnJson;
};

export default fileLoader;
