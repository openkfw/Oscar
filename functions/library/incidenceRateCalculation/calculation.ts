import { Context } from '@azure/functions';
import config from './config';
import { getCasesSum, getCountryCasesAndPopulationSum, getPopulationDataForFeatures, storeToDb } from './db';

/**
 * Calculates incidence rate per 100k
 * @param  {number} positiveNumber - number of positive cases
 * @param  {number} population - overall population in selected region
 */
const incidenceValueCalculation = (positiveNumber: number, population: number) =>
  (positiveNumber * 100000) / population; // first multiply then divide to optimise operations

/**
 * Calculation of 7 days incidence rate for selected geographical level
 * @param  {Context} context - function context to pass logs
 * @param  {string} currentDataDate - date of the incoming data
 * @param  {string} level - geographical level, e.g. 'country', 'province', 'district'
 */
const sevenDaysIncidenceRate = async (
  context: Context,
  currentDataDate: string,
  level: string,
  configurationData: any,
) => {
  const currentDate = `${currentDataDate}T00:00:00.000Z`;
  const currentDateObject = Date.parse(currentDate);
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDaysAgo = new Date(currentDateObject - 7 * oneDay);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const sevenDaysAgoInDbString = sevenDaysAgo.toISOString().split('Z')[0];

  const incomingAttributeId = `${configurationData.dailyCasesBaseAttribute}${level}`;
  const populationAttributeId = `${configurationData.populationBaseAttribute}${level}`;
  const outcomingAttributeId = `${configurationData.calculatedAttribute}${level}`;

  let incidence = [];

  if ([configurationData.countryLevel1, configurationData.countryLevel2].includes(level)) {
    const sums = await getCasesSum(
      configurationData.databaseCollection,
      incomingAttributeId,
      currentDataDate,
      sevenDaysAgoInDbString,
    );
    const featureIdsWithData = [];
    const correctSums = sums.map((feature) => {
      const { featureId } = feature;
      featureIdsWithData.push(featureId);
      return {
        attributeId: outcomingAttributeId,
        featureId,
        date: currentDataDate,
        valueNumber: feature.sum,
      };
    });
    if (featureIdsWithData.length) {
      const population = await getPopulationDataForFeatures(
        configurationData.databaseCollection,
        populationAttributeId,
        featureIdsWithData,
      );
      incidence = correctSums.map((item) => {
        const populationForFeature = population.find(
          (ft) => ft.featureId.toUpperCase() === item.featureId.toUpperCase(),
        );
        let incidenceValue = null;
        if (populationForFeature && populationForFeature.valueNumber) {
          incidenceValue = incidenceValueCalculation(item.valueNumber, populationForFeature.valueNumber);
        }
        return {
          ...item,
          valueNumber: incidenceValue,
        };
      });
    }
  } else if (level === configurationData.countryLevel0) {
    const sums = await getCountryCasesAndPopulationSum(
      configurationData.databaseCollection,
      incomingAttributeId,
      populationAttributeId,
      currentDataDate,
      sevenDaysAgoInDbString,
    );
    let incidenceValue = null;
    const population = sums.find((feature) => feature.attributeId === populationAttributeId);
    const cases = sums.find((feature) => feature.attributeId === incomingAttributeId);
    if (population && population.sum && cases && cases.sum) {
      incidenceValue = incidenceValueCalculation(cases.sum, population.sum);
    }
    incidence.push({
      attributeId: outcomingAttributeId,
      featureId: config.country,
      date: currentDataDate,
      valueNumber: incidenceValue,
    });
  }
  if (incidence && incidence.length > 0) {
    const incidenceWithValues = incidence.filter((inc) => inc.valueNumber && inc.featureId);
    await storeToDb(configurationData.databaseCollection, incidenceWithValues);
    context.log(`7 days incidence rate stored in database for ${incidenceWithValues.length} ${level}(s)`);
  } else {
    context.log('Not enough data for incidence calculation');
  }
};
export default sevenDaysIncidenceRate;
