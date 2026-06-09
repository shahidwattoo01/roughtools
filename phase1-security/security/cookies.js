const security = require("../config/security");

const setCookie = (res, name, value, options = {}) => {
  res.cookie(name, value, {
    ...security.cookie.options,
    ...options,
  });
};

const clearCookie = (res, name) => {
  res.clearCookie(name, { path: "/" });
};

module.exports = { setCookie, clearCookie };
