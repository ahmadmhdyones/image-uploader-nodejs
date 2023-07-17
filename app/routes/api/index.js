const { Router } = require('express');

const { apiVersion } = require('../../config/app.conf');
const imageRouter = require('./image.router');

const router = Router();

router.use('/image', imageRouter);
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: { message: `image-uploader api v${apiVersion}` },
  });
});

module.exports = router;
