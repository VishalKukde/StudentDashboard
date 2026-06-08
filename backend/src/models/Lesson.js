import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    order: { type: Number, default: 0 },
    content: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
