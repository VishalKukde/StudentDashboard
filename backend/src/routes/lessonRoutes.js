const router = require("express").Router();
const { getLessonById, completeLesson } = require("../controllers/lessonController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { validateCompleteLesson } = require("../validation/schemas");

router.get("/:id", protect, getLessonById);
router.post("/complete", protect, validate(validateCompleteLesson), completeLesson);

module.exports = router;
