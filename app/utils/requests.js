/**
 * Wraps an asynchronous request handler function to catch any errors and pass them to the error handling middleware.
 *
 * @function
 * @param {Function} fn - The asynchronous request handler function to wrap.
 * @return {Function} Returns a new function that catches errors and passes them to the error handling middleware.
 */
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

/**
 * Checks if the given query parameters are valid based on a list of allowed keys.
 *
 * @function
 * @param {Array<string>} keys - The list of allowed query parameter keys.
 * @param {Object} query - The query object to check.
 * @return {boolean} Returns true if all query parameters are valid, false otherwise.
 */
const isValidParams = (keys, query) => {
  const allowedParams = keys;
  const queryParams = Object.keys(query);
  const isValid = queryParams.every((param) => allowedParams.includes(param));
  return isValid;
};

module.exports = {
  catchAsync,
  isValidParams,
};
