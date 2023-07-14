const { Router } = require('express');

const apiRouter = require('./api/index');
const webRouter = require('./web/index');
const { apiVersion } = require('../config/app.conf');
const { AppError } = require('../utils/index');

const router = Router();

router.use(['/api', `/api/v${apiVersion}`], apiRouter);
router.use('/', webRouter);

router.all('*', (req, res, next) => {
  next(
    new AppError(
      `Not found - Can't find ${req.originalUrl} on the server!`,
      404
    )
  );
});

module.exports = router;
