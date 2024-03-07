
const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
  {
    tagName: {
      type: String,
      required: [true, "Tag name is required."],
      trim: true,
    },
    languages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: [true, "language name is required."],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
