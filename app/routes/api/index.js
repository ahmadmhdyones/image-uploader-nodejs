const { Router } = require('express');
const appConfig = require('../../config/app.conf');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: { message: `image-uploader api v${appConfig.apiVersion}` },
  });
});

module.exports = router;
