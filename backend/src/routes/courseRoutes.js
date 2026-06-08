import express from "express";
import { getCourses, getCourseById } from "../controllers/courseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);

export default router;
