const router = require("express").Router();
const { createActivity, getActivities } = require("../controllers/activityController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { validateActivity } = require("../validation/schemas");

router.post("/", protect, validate(validateActivity), createActivity);
router.get("/", protect, getActivities);

module.exports = router;
