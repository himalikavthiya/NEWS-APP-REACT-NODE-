const express = require("express");
const { singleFileUpload } = require("../../helper/upload");
const {
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../../controllers/admin/adminCategoryContoller");
const router = express.Router();

/* ----------------------- add category route ----------------------- */
router.post(
  "/add-category",
  singleFileUpload("/category-images/", "categoryImage"),
  addCategory
);

/* ----------------------- get category route ----------------------- */
router.get("/get-category", getCategory);

/* ----------------------- delete category route  ----------------------- */
router.delete("/delete-category/:id", deleteCategory);

/* ----------------------- update category route  ----------------------- */
router.put(
  "/update-category/:id",
  singleFileUpload("/category_images/", "image"),
  updateCategory
);

module.exports = router;
