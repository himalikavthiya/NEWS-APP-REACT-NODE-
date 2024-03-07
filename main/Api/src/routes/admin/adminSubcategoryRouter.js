const express = require("express");
const { addSubCategory, getSubCategory } = require("../../controllers/admin/adminSubCategoryContro");

const router = express.Router();

/* ----------------------- add sub category route ----------------------- */
router.post("/add-subCategory", addSubCategory);


/* ----------------------- get sub category route ----------------------- */
router.get("/get-subCategory", getSubCategory);

/* ----------------------- delete category route  ----------------------- */

module.exports = router;
