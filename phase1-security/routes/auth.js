const router = require("express").Router();
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validators/authValidator");
const validate = require("../middleware/validators/inputValidator");
const { loginLimiter } = require("../config/rateLimit");
const authController = require("../controllers/authController");

router.post("/register", registerValidation, validate, authController.register);
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validate,
  authController.login,
);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

module.exports = router;
