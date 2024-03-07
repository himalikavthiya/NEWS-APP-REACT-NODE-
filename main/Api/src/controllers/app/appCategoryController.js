const Category = require("../../models/categoryModel");


/* ----------------------------- Get personalize data ----------------------------- */
const getCategory = async (req, res) => {
  try {
    const CategoryData = await Category.find().populate([
      {
        path:"subcategory",
        select: ["subCategoryName"],
      },
      {
        path: "languages",
        select: ["languagesName"],
      }
    ]);

    if (!CategoryData) {
      return res.status(404).json({ message: "Category  data not found" });
    }

    res.status(200).json({
      success: true,
      message: "get all Category data ",
      personalize: CategoryData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};





module.exports = { getCategory };
