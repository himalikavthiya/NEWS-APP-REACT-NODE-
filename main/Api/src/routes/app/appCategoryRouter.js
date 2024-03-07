const express = require("express");
const { getCategory } = require("../../controllers/app/appCategoryController");
const verifyAppToken = require("../../helper/verifyAppToken");

const router = express.Router();


router.get("/get-category",verifyAppToken, getCategory);

module.exports = router;
