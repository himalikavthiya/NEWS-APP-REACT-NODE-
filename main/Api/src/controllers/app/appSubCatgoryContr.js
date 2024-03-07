const subCategory = require("../../models/subCategoryModel");

/* ----------------------------- Get Sub Category data ----------------------------- */
const getSubCategoryById = async (req, res) => {
  try {
    const subCategoryList = await subCategory.find();

    if (!subCategoryList) {
      return res.status(404).json({ message: "subCategory  data not found" });
    }

    res.status(200).json({
      success: true,
      message: "subCategory List was successfully",
      personalize: subCategoryList,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubcategoriesByCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    // if (!req.body.categoryIds || req.body.categoryIds.length < 3) {
    //   throw new Error("select at least 3 category are required.");
    // }

    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryIds" });
    }

    const subcategories = await subCategory.find({
      categoryName: { $in: categoryIds },
    });
    res.status(200).json({
      success: true,
      message: "list of subCategory data ",
      subcategories: subcategories,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getSubCategoryById,
  getSubcategoriesByCategories,
};
