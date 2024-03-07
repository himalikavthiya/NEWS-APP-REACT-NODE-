const express = require("express");
const {
  allnewsList,
  getNewsById,
  searchNews,
 
  forYouNewsList,
  getVideoNewList
} = require("../../controllers/app/appNewsController");
const verifyAppToken = require("../../helper/verifyAppToken");

const router = express.Router();

router.get("/get-allnews", allnewsList);

router.get("/get-news/:id", getNewsById);

router.get("/get-searchNews", searchNews);

router.post("/allForYouNews", verifyAppToken, forYouNewsList);

router.get("/video-news",verifyAppToken,getVideoNewList);


module.exports = router;
