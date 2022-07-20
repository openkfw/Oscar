export const dateIsValid = (date: string): Boolean => {
  const dateParsed = new Date(Date.parse(date));

  if (dateParsed.toISOString() === date) {
    return true;
  }
  return false;
};

export const dateIsValidDatum = (date: string): Boolean => {
  const dateParsed = new Date(Date.parse(date));

  if (dateParsed.toISOString().slice(0, 10) === date) {
    return true;
  }
  return false;
};

export default {
  forwardError: (callback) => async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  dateIsValid,
  dateIsValidDatum,
};