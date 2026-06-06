const router = require("express").Router();
const { register, login, profile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { validateAuth } = require("../validation/schemas");

router.post("/register", validate(validateAuth), register);
router.post("/login", validate(validateAuth), login);
router.get("/profile", protect, profile);

module.exports = router;
