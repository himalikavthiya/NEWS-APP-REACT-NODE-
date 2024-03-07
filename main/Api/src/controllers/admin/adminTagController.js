const Tag = require("../../models/tagModel");

/* -------------------------------add tag data------------------------------ */
const addTag = async (req, res) => {
  try {
    const reqbody = req.body;

    /** create personalize using model */
    const tag = await Tag.create(reqbody);

    if (!tag) {
      return res.status(404).json({ message: "Tag data not found" });
    }
    res.status(200).json({
      success: true,
      message: `Tag data add successfully!`,
      data: tag,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

  
const getTagData = async (req, res) => {
  try {
    const tag = await Tag.find().populate({
      path:"languages",
      select:["languagesName"]
    }); 

    if (!tag) {
      return res.status(404).json({ message: "Tag data not found" });
    }
    res.status(200).json({
      success: true,
      message: `Tag data get successfully!`,
      data: tag,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { addTag, getTagData };
