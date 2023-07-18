const fs = require('fs');
const path = require('path');

const sharp = require('sharp');
const slugify = require('slugify');

const { storageUploadsPath } = require('../config/app.conf');

/**
 * Returns the media type of the given file based on its mimetype.
 *
 * @function
 * @param {Object} file - The file object to get the media type for.
 * @param {string} file.mimetype - The mimetype of the file.
 * @return {string} The media type of the file ('image', 'audio', 'video', or 'unknown').
 */
const getMediaType = ({ mimetype }) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.startsWith('video/')) return 'video';
  return 'unknown';
};

/**
 * Checks if the given file is an image by validating its media type and file extension.
 *
 * @function
 * @param {Object} file - The file object to check.
 * @return {boolean} Returns true if the file is an image, false otherwise.
 */
const isImage = (file) => {
  // allowed file extensions
  const fileTypes = /jpeg|png|webp|avif|gif|svg|jpg/;

  // check file extension_name and media_type
  const mediatype = getMediaType(file) === 'image';
  const extension = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  return mediatype && extension;
};

/**
 * Saves the given file as an image to the specified destination path using the 'sharp' package.
 *
 * @async
 * @function
 * @param {Object} file - The file object to save as an image.
 * @param {string} destination - The destination path for the saved image.
 * @return {Promise<Object>} A promise that resolves to the saved file object.
 *
 * @throws {Error} If the destination directory cannot be created.
 */
const saveImage = async (file, destination) => {
  const dest = path.join(storageUploadsPath, 'images', destination);
  const { dir } = path.parse(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const savedFile = await sharp(file).toFile(dest);
  return savedFile;
};

/**
 * Resizes the given image using the 'sharp' package.
 *
 * @async
 * @function
 * @param {string} source - The path or buffer of the source image to resize.
 * @param {number} width - The width of the resized image.
 * @param {number} height - The height of the resized image.
 * @return {Promise<Object>} A promise that resolves to the resized image object.
 *
 * @throws {Error} If the source image cannot be read or the image cannot be resized.
 */
const resizeImage = async (source, width, height) => {
  const image = await sharp(source).resize(width, height);

  return image;
};

/**
 * Generates a hashed filename for the given image file based on its original name, width, height, and prefix.
 *
 * @function
 * @param {string} filename - The original name of the image file.
 * @param {number} [width=''] - The width of the image, if any.
 * @param {number} [height=''] - The height of the image, if any.
 * @param {string} [prefix=''] - The prefix to add to the filename, if any.
 * @return {string} The hashed filename for the image.
 */
const getImageHashedName = (filename, width = '', height = '', prefix = '') => {
  const { name, ext } = path.parse(filename);
  let w = width ? `_${width}` : '_';
  let h = height ? `_${height}` : '_';
  const pre = prefix ? `${prefix}_` : '';
  if (!width && !height) {
    w = '';
    h = '';
  }

  const slug = slugify(`${pre}${name}${w}${h}${ext}`, { lower: true });
  return slug;
};

/**
 * Determines whether an image resolution is valid, based on its width and height.
 *
 * @param {Object} resolution - An object containing the width and height of an image.
 * @param {number|string} resolution.width - The width of the image in pixels.
 * @param {number|string} resolution.height - The height of the image in pixels.
 *
 * @returns {boolean} true if the resolution is valid (positive integers), false otherwise.
 */
const isValidImageResolution = ({ width, height }) => {
  const w = Number(width);
  const h = Number(height);

  // check if the initial values were zero
  if (w === 0 && width) return false;
  if (h === 0 && height) return false;

  // check if the values are NaN
  if (Number.isNaN(w) || Number.isNaN(h)) return false;

  // check if the value was integer and positive
  if (w && (w < 1 || !Number.isInteger(w))) return false;
  if (h && (h < 1 || !Number.isInteger(h))) return false;

  return true;
};

module.exports = {
  isValidImageResolution,
  getImageHashedName,
  getMediaType,
  resizeImage,
  saveImage,
  isImage,
};
