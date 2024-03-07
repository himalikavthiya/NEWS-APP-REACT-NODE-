const mongoose = require("mongoose");

const FaqsSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required."],
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
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

const Faqs = mongoose.model("faqs", FaqsSchema);

module.exports = Faqs;
