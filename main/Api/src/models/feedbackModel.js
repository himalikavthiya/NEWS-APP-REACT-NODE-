const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    feedback: {
      type: String,
      trim: true,
      max: 500,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Feedback = mongoose.model("feedback", feedbackSchema);

module.exports = Feedback;
