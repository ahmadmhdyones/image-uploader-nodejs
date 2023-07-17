const path = require('path');

const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
require('colors');

const config = require('./config/app.conf');
const router = require('./routes');
const {
  checkPayload,
  addRequestStartTime,
  errorHandler,
} = require('./middleware');

const app = express();

app.enable('trust proxy'); // Enable trust for proxy servers

app.use(morgan('dev', config.morganOptions[0])); // For console logging
app.use(morgan('common', config.morganOptions[1])); // For file logging

app.use(cors(config.corsOptions)); // Enable cross-origin resource sharing

// app.use(checkPayload); // Check for the payload size of incoming requests
app.use(addRequestStartTime); // Add the start time of incoming requests

app.use(
  config.staticFilesPrefix,
  express.static(path.join(config.basedir, 'public'))
); // Serve static files from the public directory
app.use(
  config.storageFilesPrefix,
  express.static(path.join(config.basedir, 'uploads'))
); // Serve storage files from the uploads directory

app.use(helmet()); // Add various HTTP headers to enhance security

app.use(express.json(config.parser[0])); // Parse JSON-encoded bodies
app.use(express.urlencoded(config.parser[1])); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookie headers

app.use(mongoSanitize()); // Sanitize user input to prevent MongoDB Injection attacks
app.use(xss()); // Sanitize user input to prevent Cross-Site Scripting (XSS) attacks

app.use(hpp()); // Prevent HTTP Parameter Pollution attacks

// TODO: test the impact of compression
app.use(compression()); // Compress response bodies

app.use(router); // Mount the router middleware to handle incoming requests

app.use(errorHandler); // Handle errors that occur during request processing

module.exports = app;
