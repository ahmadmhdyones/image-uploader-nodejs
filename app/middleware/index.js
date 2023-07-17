const errorHandler = require('./errorHandler.mw');
const checkPayload = require('./checkPayload.mw');
const parseFormData = require('./parseFormData.mw');
const addRequestStartTime = require('./addRequestStartTime.mw');

module.exports = {
  errorHandler,
  checkPayload,
  parseFormData,
  addRequestStartTime,
};
