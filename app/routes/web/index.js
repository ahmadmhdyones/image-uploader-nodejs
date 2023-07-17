const path = require('path');

const { Router } = require('express');
const { basedir } = require('../../config/app.conf');

const VIEWS_PATH = path.join('app', 'views');
const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS_PATH, 'index.html'), { root: basedir });
});

module.exports = router;
