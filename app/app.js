const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('colors');

const router = require('./routes/index');
const config = require('./config/app.conf');
const errorHandler = require('./controllers/error.controller');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev', config.morganOptions[0]));
app.use(morgan('common', config.morganOptions[1]));
app.use(cors(config.corsOptions));

// Serving static and storage files
app.use(
  config.staticFilesPrefix,
  express.static(path.join(config.basedir, 'public'))
);
app.use(
  config.storageFilesPrefix,
  express.static(path.join(config.basedir, 'uploads'))
);

app.use(router);
app.use(errorHandler);

module.exports = app;
