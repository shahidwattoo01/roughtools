require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xssClean = require("xss-clean");

const security = require("./config/security");
const corsConfig = require("./config/cors");
const helmetConfig = require("./middleware/helmet");
const { csrfProtection, csrfErrorHandler } = require("./middleware/csrf");
const httpsRedirect = require("./middleware/httpsRedirect");
const ddosProtection = require("./middleware/ddos");
const { sanitizeQuery } = require("./security/sanitize");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const securityValidator = require("./middleware/securityValidator");
const { globalLimiter } = require("./config/rateLimit");
const { createHttpsServer } = require("./security/ssl");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const cspReportRoutes = require("./routes/cspReport");
const csrfRoutes = require("./routes/csrf");
const securityRoutes = require("./routes/security");

const app = express();

// ========== PRE-SECURITY VALIDATION ==========
app.use(securityValidator);

// ========== SECURITY MIDDLEWARE (Order matters!) ==========

// 1. HTTPS Redirect
app.use(httpsRedirect);

// 2. Helmet (Security Headers + CSP)
app.use(helmetConfig);

// 3. CORS
app.use(cors(corsConfig));

// 4. DDoS Protection
app.use(ddosProtection);

// 5. Global Rate Limiter
app.use("/api/", globalLimiter);

// 6. Request Logger
app.use(requestLogger);

// 7. Body parsing with size limit
app.use(express.json({ limit: security.ddos.maxRequestSize }));
app.use(
  express.urlencoded({ extended: true, limit: security.ddos.maxRequestSize }),
);

// 8. Cookie Parser (must be before CSRF)
app.use(cookieParser(security.cookie.secret));

// 9. CSRF Protection
app.use(csrfProtection);
app.use(csrfErrorHandler);

// 10. XSS Protection
app.use(xssClean());

// 11. MongoDB Sanitization (NoSQL injection)
app.use(mongoSanitize());

// 12. HPP (HTTP Parameter Pollution)
app.use(hpp());

// 13. Input Sanitization
app.use(sanitizeQuery);

// ========== ROUTES ==========
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/security", securityRoutes);
app.use("/api", csrfRoutes);
app.use("/api", cspReportRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: security.nodeEnv,
  });
});

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ========== ERROR HANDLING ==========
app.use(errorHandler);

// ========== START SERVERS ==========
const PORT = security.port;
const SSL_PORT = security.sslPort;

// HTTP Server
const server = app.listen(PORT, () => {
  logger.info(`HTTP Server running on port ${PORT}`);
  logger.info(`Environment: ${security.nodeEnv}`);
});

// HTTPS Server (if certificates exist)
const httpsServer = createHttpsServer(app);
if (httpsServer) {
  httpsServer.listen(SSL_PORT, () => {
    logger.info(`HTTPS Server running on port ${SSL_PORT}`);
  });
}

module.exports = { app, server, httpsServer };
