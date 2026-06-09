const security = require("../config/security");

const httpsRedirect = (req, res, next) => {
  if (security.ssl.enforce && req.protocol === "http") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

module.exports = httpsRedirect;
