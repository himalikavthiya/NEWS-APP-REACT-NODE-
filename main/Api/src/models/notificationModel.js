const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    languages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "languages",
         },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory", //model name
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    notifiImage:{
       type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
