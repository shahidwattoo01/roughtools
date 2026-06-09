const jwt = require("jsonwebtoken");
const security = require("../config/security");

const generateToken = (payload) => {
  return jwt.sign(payload, security.jwt.secret, {
    expiresIn: security.jwt.expiresIn,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, security.jwt.refreshSecret, {
    expiresIn: security.jwt.refreshExpiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, security.jwt.secret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, security.jwt.refreshSecret);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
