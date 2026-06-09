const security = require("./security");

module.exports = {
  origin: function (origin, callback) {
    if (!origin || security.isDev || security.trustedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["X-CSRF-Token", "X-RateLimit-Limit"],
  maxAge: 86400,
};
