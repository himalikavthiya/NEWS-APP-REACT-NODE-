const News = require("../../models/newsModel");

/* -------------------------------add Personalize data------------------------------ */
const addNews = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.files.newsImage) {
      reqbody.newsImage = req.files.newsImage[0].filename;
    }

    if (req.files.multipleImage) {
      reqbody.multipleImage = req.files.multipleImage.map(
        (file) => file.filename
      );
    }
    if (req.files.video) {
      reqbody.video = req.files.video[0].filename;
    }

    // if (reqbody.contentType !==) {
    //   throw new Error("Content-Type not supported");
    // }
    const newsData = await News.create(reqbody);

    if (!newsData) {
      return res.status(404).json({ message: "News Data not found" });
    }

    res.status(200).json({
      success: true,
      message: `News Data data add successfully!`,
      data: newsData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ----------------------------- Get News data ----------------------------- */
const allNewsList = async (req, res) => {
  try {
    const newsData = await News.find().populate([
      {
        path: "languages",
        select: ["languagesName"],
      },
      {
        path: "category",
        select: ["categoryName"],
      },
      {
        path: "subcategory",
        select: ["subCategoryName"],
      },
      {
        path: "tag",
        select: ["tagName"],
      },
      {
        path: "location",
        select: ["locationName"],
      },
    ]);

    if (!newsData) {
      return res.status(404).json({ message: "News list ata not found" });
    }
    res.status(200).json({
      success: true,
      message: "News data get successfully ",
      data: newsData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addNews, allNewsList };
