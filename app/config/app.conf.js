const path = require('path');
const rfs = require('rotating-file-stream');

const basedir = process.env.NODE_PATH;
const logLevel = process.env.LOG_LEVEL;
const environment = process.env.NODE_ENV;

const staticFilesPrefix = '/static';
const storageFilesPrefix = '/storage';

const apiVersion = process.env.API_VERSION;
const maxPayloadSize = 25 * 1024 * 1024; // 25MB

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

module.exports = {
  corsOptions,
  morganOptions,
  basedir,
  logLevel,
  environment,
  staticFilesPrefix,
  storageFilesPrefix,
  apiVersion,
  maxPayloadSize,
};
