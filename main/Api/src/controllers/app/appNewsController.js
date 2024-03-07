const News = require("../../models/newsModel");

/* ----------------------------- Get News data ----------------------------- */
const allnewsList = async (req, res) => {
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

/* ----------------------------- Get News data ----------------------------- */

const forYouNewsList = async (req, res) => {
  try {
    const { languageId, categoryId } = req.body;

    const filter = {};
    if (languageId) {
      filter.languages = languageId;
    }
    if (categoryId && (categoryId == 1 || categoryId >= 3)) {
      filter.category = categoryId;
    } else {
      throw new Error("CategoryId must be 3 are required.");
    }

        const newsData = await News.find(filter).populate([
      {
        path: "category",
        select: ["categoryName"],
      },
      {
        path: "languages",
        select: ["languagesName"],
      },
    ]);

    if (!newsData) {
      return res
        .status(404)
        .json({ success: false, message: "News list data not found" });
    }

    res.status(200).json({
      success: true,
      message: "News data retrieved successfully",
      data: newsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------- Get particuler News data ----------------------------- */
const getNewsById = async (req, res) => {
  try {
    const newsData = await News.findById(req.params.id);

    if (!newsData) {
      return res.status(404).json({ message: "News list ata not found" });
    }

    res.status(200).json({
      success: true,
      message: "Get News data successfully ",
      personalize: newsData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------- Get particuler News search data ----------------------------- */
const searchNews = async (req, res) => {
  try {
    const { query } = req.query;

    // Use a regular expression for case-insensitive search
    const regex = new RegExp(query, "i");

    // Perform the search
    const results = await News.find({
      $or: [ { title: regex }],
    });

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching news found for the given result.",
      });
    }

    // If results are found, return a success response with the search results
    res.status(200).json({
      success: true,
      message: "News data retrieved successfully.",
      searchResults: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/* ----------------------------- Get video News List ----------------------------- */
const getVideoNewList = async (req, res) => {
  try {
    const videoNewsData = await News.find({
      contentType: 2,
    }).sort({ createdAt: -1 }).populate([
        {
          path: "category",
          select: ["categoryName"],
        },
        {
          path: "languages",
          select: ["languagesName"],
        },
      ]);;

    res.status(200).json({
      success: true,
      message: "Video news retrieved successfully.",
      videoNews: videoNewsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  allnewsList,
  forYouNewsList,
  getNewsById,
  searchNews,
  getVideoNewList,
};
