const multer = require('multer');

const service = require('../services/image.service');
const { maxPayloadSize } = require('../config/app.conf');
const {
  isImage,
  AppError,
  catchAsync,
  isValidParams,
  getImageHashedName,
  mapImageAsResponse,
} = require('../utils');

/**
 * Multer middleware for uploading files.
 *
 * @constant
 * @description This controller handles the POST /images/upload API endpoint for uploading an image file.
 */
const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxPayloadSize },
  fileFilter: (req, file, cb) => {
    if (isImage(file)) return cb(null, true);
    cb(new AppError('You can upload images only!', 400));
  },
}).single('file');

/**
 * Controller for creating an image file.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 * @throws {AppError} Throws an error if the request file is empty or if there is an error creating the file.
 * @description This controller handles the POST /images/upload API endpoint for creating an image file.
 */
const createFile = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError('Empty file! you have to upload a file', 400));

  const { file } = req;
  file.filename = getImageHashedName(file.originalname, '', '', req.start);

  const newFile = await service.createOne(file);

  res.status(201).json({
    status: 'success',
    data: { image: mapImageAsResponse(newFile) },
  });
});

/**
 * Controller for getting an image file by name and resolution.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the application's request-response cycle.
 * @throws {AppError} Throws an error if the query parameters are invalid or if the file is not found.
 * @description This controller handles the GET /images/:name API endpoint for retrieving an image file by name and resolution.
 */
const getFileByName = catchAsync(async (req, res, next) => {
  if (!isValidParams(['w', 'h'], req.query))
    return next(new AppError('Invalid query parameters', 400));

  const { name } = req.params;
  const resolution = {
    width: Number(req.query.w) || null,
    height: Number(req.query.h) || null,
  };

  const file = await service.findOrCreateOneByNameAndResolution(
    name,
    resolution
  );

  if (!file) return next(new AppError('No such file', 404));

  const statusCode = file.isGenerated === true ? 201 : 200;
  res.status(statusCode).json({
    status: 'success',
    data: { image: mapImageAsResponse(file) },
  });
});

module.exports = {
  uploadFile,
  createFile,
  getFileByName,
};
