import validator from 'validator';

const validations = {
  comment: (value) => validator.isLength(value, { min: 0, max: 1000 }),
  commentMessage: "Can't be longer than 1000 characters",
  contact: (value) => validator.isEmail(value) || validator.isMobilePhone(value),
  contactMessage: 'Not a valid email address or phone number',
  details: (value) => validator.isLength(value, { min: 0, max: 50 }),
  detailsMessage: "Can't be longer than 50 characters",
  date: (value) => validator.isDate(value),
  dateMessage: 'Not a valid date',
  name: (value) => validator.isLength(value, { min: 0, max: 100 }),
  nameMessage: "Can't be longer than 100 characters",
};

export default validations;
