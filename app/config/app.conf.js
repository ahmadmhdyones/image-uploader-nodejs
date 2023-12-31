/**
 * Configuration object for the application.
 *
 * @typedef {Object}
 * @property {string} appurl - The URL of the application.
 * @property {string} appname - The name of the application.
 * @property {string} basedir - The base directory of the application.
 * @property {string} logLevel - The log level of the application.
 * @property {string} environment - The environment of the application.
 * @property {string} staticFilesPrefix - The prefix for static files served by the application.
 * @property {string} storageFilesPrefix - The prefix for storage files served by the application.
 * @property {string} storageUploadsPath - The path where uploaded files are stored.
 * @property {string} apiVersion - The version of the API.
 * @property {number} maxPayloadSize - The maximum payload size for requests.
 * @property {Object} corsOptions - The CORS options for the application.
 * @property {Object[]} morganOptions - The options for the Morgan logger middleware.
 * @property {Object[]} helmetOptions - The options for the HTTP security headers.
 * @property {Object[]} parser - The options for the body parser middleware.
 * @property {Object} apiLimiter - The rate limiter middleware for the API.
 */

const path = require('path');

const rfs = require('rotating-file-stream');
const rateLimit = require('express-rate-limit');

const appurl = process.env.APP_URL || 'http://localhost:8000';
const appname = process.env.APP_NAME || 'image-uploader';
const basedir = process.env.NODE_PATH || '.';
const logLevel = process.env.LOG_LEVEL || 'debug';
const environment = process.env.NODE_ENV || 'development';

const staticFilesPrefix = '/static';
const storageFilesPrefix = '/storage';
const storageUploadsPath = path.join(basedir, 'uploads');

const apiVersion = process.env.API_VERSION || 1;
const maxPayloadSize = process.env.MAX_PAYLOAD_SIZE || 25 * 1024 * 1024; // 25MB

const corsOptions = {
  origin: '*',
  credentials: false, // access-control-allow-credentials
  methods: ['GET', 'POST'], // access-control-allow-methods
  optionSuccessStatus: 200, // for some legacy browsers (IE11, various SmartTVs) choke on 204
};

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(basedir, 'logs'),
});
/**
 * Two options instances:
 * log all requests to a file using Apache format,
 * but error responses are logged to the console.
 */
const morganOptions = [
  {
    skip: (req, res) => res.statusCode < 400, // log only 4xx and 5xx responses to console
    stream: process.stdout,
  },
  {
    stream:
      process.env.NODE_ENV === 'development' ? process.stdout : accessLogStream,
  },
];

const helmetOptions = {
  contentSecurityPolicy: false,
};

const parser = [
  {
    limit: '10kb',
  },
  {
    extended: true,
    limit: '10kb',
  },
];

const apiLimiter = rateLimit({
  max: process.env.API_LIMIT_MAX || 100,
  windowMs: process.env.API_LIMIT_WINDOW || 60 * 60 * 100, // one hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

module.exports = {
  appurl,
  appname,
  basedir,
  logLevel,
  environment,
  staticFilesPrefix,
  storageFilesPrefix,
  storageUploadsPath,
  apiVersion,
  maxPayloadSize,
  corsOptions,
  morganOptions,
  helmetOptions,
  parser,
  apiLimiter,
};
