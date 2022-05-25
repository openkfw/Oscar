// eslint-disable-next-line import/prefer-default-export
export const isNumberInString = (value) => {
  if (typeof value === 'number') {
    return value;
  }
  const pointSeparatedFloat = /^[+-]?((\.\d+)|(\d+(\.\d+)?)|(\d+\)))$/;
  if (value.match(pointSeparatedFloat)) {
    return value;
  }
  const comaSeparatedFloat = /^[+-]?((,\d+)|(\d+(,\d+)?)|(\d+\)))$/;
  if (value.match(comaSeparatedFloat)) {
    return value.replace(',', '.');
  }
  return null;
};
