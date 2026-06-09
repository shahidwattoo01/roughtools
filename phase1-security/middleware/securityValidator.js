const { validateAllSecrets } = require("../security/secrets");
const security = require("../config/security");
const logger = require("../utils/logger");

const validateSecurityConfig = (req, res, next) => {
  try {
    // Validate secrets in production
    if (security.isProd) {
      validateAllSecrets();
    }

    // Check for common misconfigurations
    const warnings = [];

    if (security.isProd && security.cookie.options.secure === false) {
      warnings.push("Cookie secure flag should be true in production");
    }

    if (security.isProd && security.cookie.options.sameSite !== "strict") {
      warnings.push("Cookie sameSite should be 'strict' in production");
    }

    if (security.isProd && security.ssl.enforce === false) {
      warnings.push("HTTPS should be enforced in production");
    }

    if (warnings.length > 0) {
      warnings.forEach((w) => logger.warn(`Security Warning: ${w}`));
    }

    next();
  } catch (err) {
    logger.error("Security configuration validation failed:", err.message);
    next(err);
  }
};

module.exports = validateSecurityConfig;
