const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory", //model name subCategory
      },
    ],
    languages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: [true, "language name is required."],
      },
    ],
    categoryImage: {
      type: String,
      required: [true, "Image is required."],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
