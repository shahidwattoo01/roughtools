const fs = require("fs");
const https = require("https");
const security = require("../config/security");
const logger = require("../utils/logger");

const createHttpsServer = (app) => {
  try {
    const certPath = security.ssl.certPath;
    const keyPath = security.ssl.keyPath;

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      logger.warn("SSL certificates not found. HTTPS not enabled.");
      logger.warn("To enable HTTPS, place certificates at:");
      logger.warn(`  - ${certPath}`);
      logger.warn(`  - ${keyPath}`);
      return null;
    }

    const sslOptions = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      minVersion: "TLSv1.2",
      ciphers: [
        "ECDHE-ECDSA-AES128-GCM-SHA256",
        "ECDHE-RSA-AES128-GCM-SHA256",
        "ECDHE-ECDSA-AES256-GCM-SHA384",
        "ECDHE-RSA-AES256-GCM-SHA384",
      ].join(":"),
      honorCipherOrder: true,
      rejectUnauthorized: true,
    };

    const httpsServer = https.createServer(sslOptions, app);
    return httpsServer;
  } catch (err) {
    logger.error("Failed to create HTTPS server:", err.message);
    return null;
  }
};

const generateSelfSignedCert = () => {
  logger.warn("===========================================");
  logger.warn("For development only - generate certs with:");
  logger.warn(
    "openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem",
  );
  logger.warn("===========================================");
};

module.exports = { createHttpsServer, generateSelfSignedCert };
