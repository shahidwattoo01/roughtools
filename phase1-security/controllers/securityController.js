const logger = require("../utils/logger");

const getCspReport = (req, res) => {
  res.json({
    success: true,
    csp: {
      enabled: true,
      directives: {
        "default-src": "'self'",
        "script-src": "'self'",
        "style-src": "'self' 'unsafe-inline'",
        "img-src": "'self' data:",
        "object-src": "'none'",
        "frame-src": "'none'",
      },
    },
  });
};

const getSecurityHeaders = (req, res) => {
  res.json({
    success: true,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
      "Content-Security-Policy": "Enabled",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
};

const reportCspViolation = (req, res) => {
  const violation = req.body;
  logger.warn("CSP Violation detected", {
    "document-uri": violation["csp-report"]?.["document-uri"],
    "violated-directive": violation["csp-report"]?.["violated-directive"],
    "blocked-uri": violation["csp-report"]?.["blocked-uri"],
  });
  res.status(204).end();
};

module.exports = { getCspReport, getSecurityHeaders, reportCspViolation };
