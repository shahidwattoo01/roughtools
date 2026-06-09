const router = require("express").Router();
const logger = require("../utils/logger");

router.post("/csp-report", (req, res) => {
  logger.warn("CSP Violation:", req.body);
  res.status(204).end();
});

module.exports = router;
