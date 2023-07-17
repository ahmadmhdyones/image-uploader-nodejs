const ImageEntity = require('../models/ImageEntity.model');
const { resizeImage, saveImage, getImageHashedName } = require('../utils');

/**
 * Creates a new image entity in the database and saves the image file to disk.
 *
 * @async
 * @function
 * @param {Object} file - The file object to create the image entity for.
 * @param {string} file.originalname - The original name of the file.
 * @param {number} file.width - The width of the file.
 * @param {number} file.height - The height of the file.
 * @param {object} file.buffer - The buffer of the file.
 * @param {string} file.mimetype - The mimetype of the file.
 * @param {string} file.filename - The filename of the file.
 * @return {Promise<Object>} A promise that resolves to the created image entity.
 *
 * @throws {Error} If the image file cannot be saved to disk.
 */
const createOne = async (file) => {
  const entity = {
    originalName: file.originalname,
    width: file.width,
    height: file.height,
    size: Buffer.byteLength(file.buffer),
    filename: file.filename,
    type: file.mimetype,
  };

  const doc = await ImageEntity.create(entity);

  try {
    await saveImage(file.buffer, file.filename);
  } catch (err) {
    // Delete the document if image file cannot be saved to disk.
    await ImageEntity.deleteOne(doc);
    throw err;
  }

  return doc;
};

/**
 * Finds or creates an image entity with a given name and resolution.
 *
 * @async
 * @function
 * @param {string} name - The name of the image to find.
 * @param {Object} resolution - The resolution object to find or create the image for.
 * @param {number} resolution.width - The width of the image to find or create.
 * @param {number} resolution.height - The height of the image to find or create.
 * @return {Promise<Object>} A promise that resolves to the found or created image entity.
 */
const findOrCreateOneByNameAndResolution = async (name, resolution) => {
  // Looking for original image (without resizing)
  const originalDoc = await ImageEntity.findOne({
    hashedName: getImageHashedName(name),
  });

  if (originalDoc) {
    // Looking for desired image if it resized before
    let doc = await ImageEntity.findOne({
      hashedName: getImageHashedName(name, resolution.width, resolution.height),
    });

    // If the image doesn't be resized before to this resolution
    if (!doc) {
      const resizedImage = await resizeImage(
        originalDoc.fullpath,
        resolution.width,
        resolution.height
      );
      const metadata = await resizedImage.metadata();
      const buffer = await resizedImage.toBuffer();
      const filename = getImageHashedName(
        originalDoc.originalName,
        resolution.width,
        resolution.height,
        Date.now()
      );

      const file = {
        originalname: originalDoc.originalName,
        width: resolution.width,
        height: resolution.height,
        mimetype: `image/${metadata.format}`,
        filename,
        buffer,
      };

      doc = await createOne(file);
      doc.isGenerated = true; // flag to indicate whether document was created or found
    }

    return doc;
  }
  return originalDoc;
};

module.exports = {
  createOne,
  findOrCreateOneByNameAndResolution,
};
