const helmet = require("helmet");
const security = require("../config/security");

const helmetConfig = helmet({
  contentSecurityPolicy: security.csp.enabled
    ? {
        directives: security.csp.directives,
      }
    : false,
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
  noSniff: true,
  frameguard: { action: "deny" },
});

module.exports = helmetConfig;
