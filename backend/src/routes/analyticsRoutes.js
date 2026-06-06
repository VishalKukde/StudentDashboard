const router = require("express").Router();
const {
  getOverview,
  getProgress,
  getTimeSeries,
  getDistribution,
  getMentorOverview,
  getRecommendationsForUser
} = require("../controllers/analyticsController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get("/overview", protect, getOverview);
router.get("/progress", protect, getProgress);
router.get("/timeseries", protect, getTimeSeries);
router.get("/distribution", protect, getDistribution);
router.get("/recommendations", protect, getRecommendationsForUser);
router.get("/mentor", protect, authorizeRoles("mentor"), getMentorOverview);

module.exports = router;
