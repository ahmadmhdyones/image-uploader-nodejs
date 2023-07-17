const { Router } = require('express');

const imageController = require('../../controllers/image.controller');

const router = Router();

router.post('/upload', imageController.uploadFile, imageController.createFile);
router.get('/:name', imageController.getFileByName);

module.exports = router;
