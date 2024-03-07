const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    languages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: [true, "language name is required."],
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory", //model name
      },
    ],
    expiry_date: {
      type: Date,
      default: Date.now,
      required: [true, "Expiry Date name is required."],
      validate: {
        validator: function (value) {
          return value > new Date(); // Check if expiry_date is in the future
        },
        message: "Expiry Date must be a future date.",
      },
    },
    title: {
      type: String,
      trim: true,
      required: [true, "News Title name is required."],
    },
    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag", //modle name
      },
    ],
    location: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
    }],
    newsImage: {
      type: String,
      trim: true,
      required: [true, "News image name is required."],
    },
    multipleImage: [
      {
        type: String,
      },
    ],
    contentType: {
      type: String,
      default: 1, //video content type defind deafult 1
    },
    video: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    notifyUser: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const News = mongoose.model("news", newsSchema);

module.exports = News;
