const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../security/jwt");
const { setCookie, clearCookie } = require("../security/cookies");
const { hashPassword, comparePassword } = require("../security/encryption");
const logger = require("../utils/logger");

// Dummy user store (replace with database)
const users = new Map();

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (users.has(email)) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const userId = Date.now().toString();

    users.set(email, {
      id: userId,
      email,
      name,
      password: hashedPassword,
      role: "user",
    });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.warn(`Failed login attempt: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    setCookie(res, "token", token);
    setCookie(res, "refreshToken", refreshToken);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  clearCookie(res, "token");
  clearCookie(res, "refreshToken");
  logger.info("User logged out");
  res.json({ success: true, message: "Logged out successfully" });
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newToken = generateToken({ id: decoded.id });

    setCookie(res, "token", newToken);

    res.json({ success: true, token: newToken });
  } catch (err) {
    next(err);
  }
};

const getProfile = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, logout, refreshToken, getProfile };
