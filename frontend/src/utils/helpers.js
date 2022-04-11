import moment from 'moment';

export const showDate = (timestamp) => moment(timestamp).format('LL');
export const showDateAndTime = (timestamp) => moment(timestamp).format('YYYY-MM-DD kk:mm');

export const isNotDefinedIncl0 = (value) => value === undefined || value === null || value === 'N/A' || value === '';

/**
 * Round number to three decimal places.
 *
 * @param {Number} value - value which will be rounded
 * @returns {Number} - Rounded number
 */
export const roundNumber = (value) => {
  return Math.round(value * 1000) / 1000;
};

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
 * Check if the value is in interval (min, max>
 * @param  {} value
 * @param  {} min
 * @param  {} max
 */
export const isInInterval = (value, min, max) => {
  // the interval is not defined
  if (!min && min !== 0 && !max && max !== 0) {
    return false;
  }
  // min value is not defined
  if (!min && min !== 0) {
    if (value <= max) {
      return true;
    }
    return false;
  }
  // max is not defined
  if (!max && max !== 0) {
    if (value > min) {
      return true;
    }
    return false;
  }
  // regular case
  if (min < value && value <= max) {
    return true;
  }
  return false;
};

export const foundPointAddressString = (address) => {
  if (!address) {
    return 'Unknown address';
  }
  const finalAddressArray = [];
  if (address.street) {
    finalAddressArray.push(address.street);
  }
  if (address.municipalitySubdivision) {
    finalAddressArray.push(address.municipalitySubdivision);
  }
  if (address.municipality) {
    finalAddressArray.push(address.municipality);
  }
  if (address.countryTertiarySubdivision) {
    finalAddressArray.push(address.countryTertiarySubdivision);
  }
  if (address.countrySecondarySubdivision) {
    finalAddressArray.push(address.countrySecondarySubdivision);
  }
  if (address.countrySubdivision) {
    finalAddressArray.push(address.countrySubdivision);
  }
  if (address.country) {
    finalAddressArray.push(address.country);
  }
  return finalAddressArray.join(', ');
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
