const validator = require('validator');
const isEmpty = require('./isEmpty');

const validatePost = data => {
  let errors = {};

  data.content = !isEmpty(data.content) ? data.content : '';

  if (validator.isEmpty(data.content)) {
    errors.content = 'please entire a job content';
  }

  if (validator.isLength(data.content, { min: 2, max: 500 })) {
    errors.content = 'posts must be between 2 and 500 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validatePost;
