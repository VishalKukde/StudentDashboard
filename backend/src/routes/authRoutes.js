import express from "express";
import { register, login, profile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateRegister, validateLogin } from "../validation/schemas.js";

const router = express.Router();

router.post("/register", validate(validateRegister), register);
router.post("/login", validate(validateLogin), login);
router.get("/profile", protect, profile);
router.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});

export default router;
