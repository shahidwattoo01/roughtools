const crypto = require("crypto");
const logger = require("../utils/logger");

const SECRET_MIN_LENGTH = 32;

const validateSecret = (secretName, secret) => {
  if (!secret) {
    throw new Error(`Missing secret: ${secretName}`);
  }
  if (secret.length < SECRET_MIN_LENGTH) {
    throw new Error(
      `Secret ${secretName} is too short. Minimum ${SECRET_MIN_LENGTH} characters`,
    );
  }
  if (secret.includes("change-this") || secret.includes("your-")) {
    logger.warn(
      `Secret ${secretName} appears to be a default value. Change it in production!`,
    );
  }
  return true;
};

const validateAllSecrets = () => {
  const secrets = ["JWT_SECRET", "JWT_REFRESH_SECRET", "COOKIE_SECRET"];

  const missing = [];
  const weak = [];

  secrets.forEach((name) => {
    const value = process.env[name];
    if (!value) {
      missing.push(name);
    } else if (
      value.length < SECRET_MIN_LENGTH ||
      value.includes("change-this")
    ) {
      weak.push(name);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  if (weak.length > 0) {
    logger.warn(
      `Weak secrets detected: ${weak.join(", ")}. Update before production!`,
    );
  }

  return true;
};

const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString("hex");
};

const maskSecret = (secret) => {
  if (!secret || secret.length < 8) return "****";
  return secret.substring(0, 4) + "****" + secret.substring(secret.length - 4);
};

module.exports = {
  validateSecret,
  validateAllSecrets,
  generateSecret,
  maskSecret,
};
