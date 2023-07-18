/**
 * Middleware for setting the start time of incoming HTTP requests.
 *
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 */

module.exports = (req, res, next) => {
  req.start = Date.now();
  next();
};
