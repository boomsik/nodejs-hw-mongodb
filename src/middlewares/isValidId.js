const { isValidObjectId } = require('mongoose');
const createError = require('http-errors');

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createError(400, 'Invalid contact ID format'));
  }
  next();
};

module.exports = isValidId;
