import express from "express";
import { createActivity, getActivities } from "../controllers/activityController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateActivity } from "../validation/schemas.js";

const router = express.Router();

router.post("/", protect, validate(validateActivity), createActivity);
router.get("/", protect, getActivities);

export default router;
