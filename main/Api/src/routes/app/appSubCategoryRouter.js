const express = require("express");
const {  getSubCategoryById, getSubcategoriesByCategories } = require("../../controllers/app/appSubCatgoryContr");

 const router = express.Router();


router.get("/get-subCategory", getSubCategoryById);

router.get("/get-subCategoryById", getSubcategoriesByCategories);


module.exports = router;
