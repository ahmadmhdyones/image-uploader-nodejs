/**
 * Creates a custom error object that extends the built-in Error class.
 *
 * @class
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code for the error.
 * @return {AppError} A new AppError object.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
