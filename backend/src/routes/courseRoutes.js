const router = require("express").Router();
const { getCourses, getCourseById } = require("../controllers/courseController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);

module.exports = router;
