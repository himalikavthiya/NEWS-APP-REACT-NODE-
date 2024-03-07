const express = require("express");
const {
  getLanguage,
 
} = require("../../controllers/app/appLanguageController");
const verifyAppToken = require("../../helper/verifyAppToken");

const router = express.Router();

/* -------------------------- list of Language data ------------------------- */
router.get("/get-Language", 
verifyAppToken,
 getLanguage);


module.exports = router;
