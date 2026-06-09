const rateLimit = require("express-rate-limit");
const security = require("./security");

const globalLimiter = rateLimit({
  windowMs: security.rateLimit.global.windowMs,
  max: security.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP" },
});

const loginLimiter = rateLimit({
  windowMs: security.rateLimit.login.windowMs,
  max: security.rateLimit.login.max,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Try again later." },
});

module.exports = { globalLimiter, loginLimiter };
