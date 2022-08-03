/**
 * Gets starting date of interval into the past.
 * @param  {number} numberOfDays - how many days should the interval last
 */
export const getStartDate = (numberOfDays) => {
  const today = new Date();
  const requiredDay = new Date();
  requiredDay.setDate(today.getDate() - numberOfDays);
  requiredDay.setUTCHours(0, 0, 0, 0);
  const isoRequiredDay = requiredDay.toISOString();
  return isoRequiredDay;
};

/**
 * Gets scaled sum from data
 * @param {number} scale - changes scale of sum
 */
export const getSumData = (data, scale) => {
  if (data) {
    const sum = data.map((element) => element.value).reduce((acc, element) => element + acc);
    const scaledSum = sum / scale;
    return Number(scaledSum.toFixed(3));
  }
};

/**
 * Gets count of unique featureIds in data
 */
export const countUniqueFeature = (data) => {
  const uniqueFeatures = [];
  Object.keys(data).forEach((feature) => {
    Object.keys(data[feature]).forEach((element) => {
      if (!uniqueFeatures.includes(data[feature][element].featureId)) {
        uniqueFeatures.push(data[feature][element].featureId);
      }
    });
  });
  return Object.keys(uniqueFeatures).length;
};

/**
 * Check if any chart specific filter value is set
 * @param  {object} filters - all filters values in redux
 * @param  {array} specificFilters - all applicable filters of the specific chart
 */

export const hasSpecificFilters = (filters, specificFilters) => {
  const filtersJS = Object.keys(filters.toJSON());
  const hasSpecificFilters = filtersJS.some(
    (filter) => filters.getIn([filter, 'selectedValue']) !== undefined && specificFilters.includes(filter),
  );
  return hasSpecificFilters;
};
