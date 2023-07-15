const multer = require('multer');

module.exports = (req, res, next) => {
  const contentType = req.headers['content-type'];

  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    const upload = multer().any();
    upload(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  } else {
    next();
  }
};
