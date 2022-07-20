/**
 * Get date in ISO format from javascript Date object
 * @param  {Date} dateObj
 */
export const dateObjectToISODate = (dateObj) => dateObj.toISOString().split('T')[0];

/**
 * Get date object for yesterday
 */
const getYesterday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

/**
 * Replace predefined strings in queries and file names
 * @param {string} text text with placeholders, query or file name
 * @param {string} replacementDate specified date to replace placeholder with, yesterday by default
 * @returns {string} string with replaced values
 */
export const fillInValues = (text, replacementDate) => {
  const ISOdate = replacementDate || dateObjectToISODate(getYesterday());

  // fill in date of yesterday in ISO format in query
  let filled = text.replace('{{ISOdate}}', ISOdate);

  // fill in date of yesterday in "yyyymmdd" format in filename
  filled = filled.replace('{{date}}', ISOdate.replace(/-/g, ''));

  return filled;
};

/**
 * Get array of dates from given date till yesterday
 * @param  {string} lastDate - date in ISOString
 */
export const getDatesFrom = (lastDateISOString) => {
  const yesterday = getYesterday();
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const dateObj = new Date(lastDateISOString);
  dateObj.setDate(dateObj.getDate() + 1);
  const dates = [];
  while (dateObj.getTime() < yesterday.getTime()) {
    dates.push(dateObjectToISODate(dateObj));
    dateObj.setTime(dateObj.getTime() + ONE_DAY);
  }
  dates.push(dateObjectToISODate(yesterday));
  return dates;
};
