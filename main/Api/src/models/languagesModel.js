const mongoose = require("mongoose");

const languagesSchema = mongoose.Schema(
  {
    languagesName: {
      type: String,
      required: [true, "language name is required."],
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    jsonFile: {
      type: String,
      required: [true, "language JSON file is required."],
    },
    flagImage: {
      type: String,
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

const Languages = mongoose.model("languages", languagesSchema);

module.exports = Languages;
