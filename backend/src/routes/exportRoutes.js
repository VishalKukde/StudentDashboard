import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { exportProgress, exportActivities, exportMentorOverview } from "../controllers/exportController.js";

const router = express.Router();

router.get("/progress.csv", protect, exportProgress);
router.get("/activities.csv", protect, exportActivities);
router.get("/mentor.csv", protect, authorizeRoles("mentor"), exportMentorOverview);

export default router;