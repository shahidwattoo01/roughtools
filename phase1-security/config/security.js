const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  sslPort: process.env.SSL_PORT || 3443,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
      signed: true,
    },
  },

  csrf: {
    tokenLength: 32,
  },

  rateLimit: {
    global: { windowMs: 900000, max: 100 },
    login: { windowMs: 900000, max: 5 },
  },

  ssl: {
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH,
    enforce: process.env.ENFORCE_HTTPS === "true",
  },

  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },

  trustedOrigins: (process.env.TRUSTED_ORIGINS || "")
    .split(",")
    .filter(Boolean),

  ddos: {
    maxRequestSize: "10mb",
    timeoutMs: 30000,
  },
};
