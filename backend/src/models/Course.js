const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    level: { type: String, default: "Beginner" },
    order: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
