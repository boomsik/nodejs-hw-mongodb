const { isValidObjectId } = require('mongoose');
const createError = require('http-errors');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(createError(400, 'Invalid contact ID format'));
  }
  next();
};

module.exports = isValidId;
