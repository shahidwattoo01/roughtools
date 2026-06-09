const security = require("../config/security");

const ddosProtection = (req, res, next) => {
  req.setTimeout(security.ddos.timeoutMs, () => {
    if (!res.headersSent) {
      res.status(504).json({ error: "Request timeout" });
    }
  });
  next();
};

module.exports = ddosProtection;
