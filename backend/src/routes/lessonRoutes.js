import express from "express";
import { getLessonById, completeLesson } from "../controllers/lessonController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateCompleteLesson } from "../validation/schemas.js";

const router = express.Router();

router.get("/:id", protect, getLessonById);
router.post("/complete", protect, validate(validateCompleteLesson), completeLesson);

export default router;
