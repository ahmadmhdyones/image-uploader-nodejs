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

/**
 * Maps an image file object to a simplified response object.
 *
 * @param {Object} file - The file object to be mapped.
 * @param {string} file.originalName - The original name of the uploaded file.
 * @param {string} file.hashedName - The hashed name of the uploaded file.
 * @param {number} file.width - The width of the uploaded image file.
 * @param {number} file.height - The height of the uploaded image file.
 * @param {number} file.size - The size of the uploaded image file in bytes.
 * @param {string} file.type - The MIME type of the uploaded file.
 * @param {string} file.filename - The filename of the uploaded file on the server.
 * @param {string} file.src - The URL of the uploaded file on the server.
 *
 * @returns {Object} A simplified response object containing the properties:
 * - originalName
 * - hashedName
 * - width
 * - height
 * - size
 * - type
 * - filename
 * - src
 */
const mapImageAsResponse = (file) => ({
  originalName: file.originalName,
  hashedName: file.hashedName,
  width: file.width,
  height: file.height,
  size: file.size,
  type: file.type,
  filename: file.filename,
  src: file.src,
});

module.exports = {
  catchAsync,
  isValidParams,
  mapImageAsResponse,
};
