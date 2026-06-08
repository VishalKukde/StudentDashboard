import express from "express";
import {
  getOverview,
  getProgress,
  getTimeSeries,
  getDistribution,
  getMentorOverview,
  getRecommendationsForUser
} from "../controllers/analyticsController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", protect, getOverview);
router.get("/progress", protect, getProgress);
router.get("/timeseries", protect, getTimeSeries);
router.get("/distribution", protect, getDistribution);
router.get("/recommendations", protect, getRecommendationsForUser);
router.get("/mentor", protect, authorizeRoles("mentor"), getMentorOverview);

export default router;
