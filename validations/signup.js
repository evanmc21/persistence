const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSignUp = data => {
  let errors = {};

  if (!validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'name must be between 2 and 40 characters';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateSignUp;
