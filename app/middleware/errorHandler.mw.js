/* eslint-disable no-console */

/**
 * Middleware for handling errors in the application.
 *
 * @function
 * @param {Object} err - The error object.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 */

const { environment } = require('../config/app.conf');
const { AppError } = require('../utils/index');

/**
 * Function for handling a cast error in the database.
 *
 * @function
 * @param {Object} err - The cast error object.
 * @returns {AppError} Returns an 'AppError' with a message and a status code of 400.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Function for handling a file size limit error during file upload.
 *
 * @function
 * @param {Object} err - The file size limit error object.
 * @returns {AppError} Returns an 'AppError' with a message and a status code of 400.
 */
const handleFileSizeLimit = (err) => {
  const message = `Invalid upload file. ${err.message}!`;
  return new AppError(message, 400);
};

/**
 * Function for handling a duplicate field error in the database.
 *
 * @function
 * @param {Object} err - The duplicate field error object.
 * @returns {AppError} Returns an 'AppError' with a message and a status code of 400.
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Function for handling a validation error in the database.
 *
 * @function
 * @param {Object} err - The validation error object.
 * @returns {AppError} Returns an 'AppError' with a message and a status code of 400.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Function for sending error details to the client in development mode.
 *
 * @function
 * @param {Object} err - The error object.
 * @param {Object} res - The HTTP response object.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Function for sending error details to the client in production mode.
 *
 * @function
 * @param {Object} err - The error object.
 * @param {Object} res - The HTTP response object.
 */
const sendErrorProd = (err, res) => {
  // Operational error, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming error, unknown error: don't leak error details
  else {
    // 1) Log error
    console.error(`🥊 ${'Error!'.bold} ${err.name}`.red.inverse, '\n', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  let error = err;

  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (environment === 'development') {
    sendErrorDev(error, res);
  } else if (environment === 'production') {
    if (error.code === 'LIMIT_FILE_SIZE') error = handleFileSizeLimit(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
