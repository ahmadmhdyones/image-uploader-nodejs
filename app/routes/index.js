const { Router } = require('express');

const apiRouter = require('./api/index');
const webRouter = require('./web/index');
const { apiVersion, apiLimiter } = require('../config/app.conf');
const { AppError } = require('../utils/index');

const router = Router();

router.use([`/api/v${apiVersion}`, '/api'], apiLimiter, apiRouter);

router.use('/', webRouter);

router.all('*', (req, res, next) => {
  next(
    new AppError(
      `Not found - Can't find ${req.method} ${req.originalUrl} on the server!`,
      404
    )
  );
});

module.exports = router;
