const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('colors');

const router = require('./routes');
const config = require('./config/app.conf');
const errorHandler = require('./controllers/error.controller');
const { parseFormData, checkPayload } = require('./middleware');

const app = express();

// Logging middleware
app.use(morgan('dev', config.morganOptions[0]));
app.use(morgan('common', config.morganOptions[1]));

// CORS middleware
app.use(cors(config.corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(parseFormData);

// Serving static and storage files middleware
app.use(
  config.staticFilesPrefix,
  express.static(path.join(config.basedir, 'public'))
);
app.use(
  config.storageFilesPrefix,
  express.static(path.join(config.basedir, 'uploads'))
);

app.use(checkPayload);
app.use(router);
app.use(errorHandler);

module.exports = app;
