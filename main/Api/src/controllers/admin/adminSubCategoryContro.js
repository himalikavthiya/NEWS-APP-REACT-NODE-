const subCategory = require("../../models/subCategoryModel");

/* -------------------------------add sub-Category data------------------------------ */
const addSubCategory = async (req, res) => {
  try {
    const reqbody = req.body;

    /** create subcategory using model */
    const subCategory_Data = await subCategory.create(reqbody);

    if (!subCategory_Data) {
      return res.status(404).json({ message: "sub Category data not found" });
    }
    res.status(200).json({
      success: true,
      message: `sub Category data add successfully!`,
      data: subCategory_Data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,            
    });
  }
};

/* ----------------------------- Get sub-Category data ----------------------------- */
const getSubCategory = async (req, res) => {
  try {
    const subCategoryData = await subCategory.find().populate({
      path: "languages",
      select: ["languagesName"],
    });

    if (!subCategoryData) {
      return res.status(404).json({ message: "sub Category  data not found" });
    }

    res.status(200).json({
      success: true,
      message: "get all subCategory data ",
      personalize: subCategoryData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addSubCategory, getSubCategory };
