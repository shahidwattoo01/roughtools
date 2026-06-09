const xss = require("xss");

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return xss(input.trim());
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
};

const sanitizeQuery = (req, res, next) => {
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  next();
};

module.exports = { sanitizeInput, sanitizeQuery };
