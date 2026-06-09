const csrf = require("csurf");
const security = require("../config/security");

const csrfProtection = csrf({
  cookie: {
    httpOnly: false,
    secure: security.isProd,
    sameSite: "strict",
  },
  value: (req) => req.headers["x-csrf-token"] || req.body._csrf,
});

const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next(err);
};

module.exports = { csrfProtection, csrfErrorHandler };
