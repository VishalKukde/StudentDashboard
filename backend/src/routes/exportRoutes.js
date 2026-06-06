const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const { exportProgress, exportActivities, exportMentorOverview } = require("../controllers/exportController");

router.get("/progress.csv", protect, exportProgress);
router.get("/activities.csv", protect, exportActivities);
router.get("/mentor.csv", protect, authorizeRoles("mentor"), exportMentorOverview);

module.exports = router;