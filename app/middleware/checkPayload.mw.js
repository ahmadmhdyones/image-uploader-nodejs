/**
 * Middleware for checking the payload (payload size, etc) of incoming HTTP requests.
 *
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 * @throws {AppError} If the payload size of the incoming request is larger than the configured maximum payload size, returns an 'AppError' with a 'Payload Too Large' message and a status code of 413.
 */

const { maxPayloadSize } = require('../config/app.conf');
const { AppError } = require('../utils');

module.exports = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'], 10);

  if (contentLength > maxPayloadSize) {
    next(
      new AppError(
        `Payload Too Large, your payload should be smaller than ${maxPayloadSize}MB`,
        413
      )
    );
  }

  next();
};
