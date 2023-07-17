const path = require('path');

const mongoose = require('mongoose');
const validator = require('validator');

const { getMediaType, getImageHashedName } = require('../utils');
const {
  appurl,
  maxPayloadSize,
  storageUploadsPath,
  storageFilesPrefix,
} = require('../config/app.conf');

const imageEntitySchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
    },
    hashedName: String,
    width: {
      type: Number,
      min: [0, 'Width must be a non-negative number, got {VALUE}'],
      default: null,
    },
    height: {
      type: Number,
      min: [0, 'Height must be a non-negative number, got {VALUE}'],
      default: null,
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
      min: [1, 'Size must be positive'],
      max: [maxPayloadSize, `Size must be smaller than ${maxPayloadSize}MB`],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      unique: [true, 'Filename must be unique'],
    },
    type: {
      type: String,
      required: [true, 'File media type is required'],
      validate: [validator.isMimeType, '{VALUE} is not supported'],
    },
  },
  {
    timestamps: true,
    collection: 'image-entities',
  }
);

imageEntitySchema.index({ hashedName: 1 }, { unique: true });

// Create a compound index to enforce uniqueness [width, height, originalName]
imageEntitySchema.index(
  { width: 1, height: 1, originalName: 1 },
  { unique: true }
);

imageEntitySchema.virtual('fullpath').get(function () {
  const mimetype = this.type;
  const storageUploadSubPath = `${getMediaType({ mimetype })}s`;
  return path.join(storageUploadsPath, storageUploadSubPath, this.filename);
});

imageEntitySchema.virtual('src').get(function () {
  const mimetype = this.type;
  const storageUploadSubPath = `/${getMediaType({ mimetype })}s`;
  const filepath = path.join(
    storageFilesPrefix,
    storageUploadSubPath,
    this.filename
  );
  return `${appurl}${filepath}`;
});

imageEntitySchema.pre('save', function (next) {
  this.hashedName = getImageHashedName(
    this.originalName,
    this.width,
    this.height
  );
  next();
});

const ImageEntity = mongoose.model('ImageEntity', imageEntitySchema);

module.exports = ImageEntity;
