const logger = require("./logger");
const security = require("../config/security");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    security.isProd && statusCode === 500
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(security.isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
