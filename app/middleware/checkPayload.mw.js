const { maxPayloadSize } = require('../config/app.conf');
const { AppError } = require('../utils');

module.exports = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'], 10);

  if (contentLength > maxPayloadSize) {
    next(new AppError('Payload Too Large', 413));
  }

  next();
};
