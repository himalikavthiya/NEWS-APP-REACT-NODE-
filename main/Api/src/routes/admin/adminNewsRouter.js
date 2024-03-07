const express = require("express");
const { multiDiffFileUpload } = require("../../helper/upload");
const {
  addNews,
  allNewsList,
} = require("../../controllers/admin/adminNewsController");
const router = express.Router();

router.post(
  "/add-news",
  multiDiffFileUpload("/News_image/", [
    {
      name: "newsImage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "multipleImage",
      maxCount: 15,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "video",
      maxCount: 1,
      allowedMimes: ["video/mp4"],
    },
  ]),
  addNews
);

router.get("/get-news", allNewsList);

module.exports = router;
