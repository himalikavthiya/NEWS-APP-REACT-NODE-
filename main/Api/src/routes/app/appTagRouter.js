const express = require("express");
const { getTrendingTags } = require("../../controllers/app/appTagController");

const router = express.Router();

/* ------------- Route to get the latest trending hashtag list ------------ */
router.get("/trending-tags", getTrendingTags);

module.exports = router;
