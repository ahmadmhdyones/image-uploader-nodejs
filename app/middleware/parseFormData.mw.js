/**
 * Middleware for handling file uploads using 'multer' package and storing uploaded files on the server.
 *
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 * @throws {AppError} If an error occurs during file upload, returns an 'AppError' with an appropriate status code.
 */

const fs = require('fs');
const path = require('path');

const multer = require('multer');

const { storageUploadsPath } = require('../config/app.conf');
const { AppError, getMediaType } = require('../utils');

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const storageUploadsSubPath = `${getMediaType(file)}s`;
    const dir = path.join(storageUploadsPath, storageUploadsSubPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = `${req.start}_${file.originalname}`;
    cb(null, filename);
  },
});

const options = {
  storage: storageEngine,
};

const upload = multer(options).any();

module.exports = (req, res, next) => {
  const contentType = req.headers['content-type'];

  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    upload(req, res, (err) => {
      if (err) {
        return next(
          err instanceof multer.MulterError
            ? new AppError(err.message, 400)
            : err
        );
      }
      next();
    });
  } else {
    next();
  }
};
