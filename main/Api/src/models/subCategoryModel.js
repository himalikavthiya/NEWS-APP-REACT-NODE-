const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: [true, "Name is required."],
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

const subCategory = mongoose.model("subcategory", subCategorySchema);

module.exports = subCategory;
