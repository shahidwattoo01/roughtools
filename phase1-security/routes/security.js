const router = require("express").Router();
const securityController = require("../controllers/securityController");

router.get("/csp-policy", securityController.getCspReport);
router.get("/headers", securityController.getSecurityHeaders);
router.post("/csp-report", securityController.reportCspViolation);

module.exports = router;
