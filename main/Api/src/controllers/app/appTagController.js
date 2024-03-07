const News = require("../../models/newsModel");


/* --------------   get the latest trending hashtag list ------------- */
const getTrendingTags= async (req, res) => {
  try {
    // Find the latest news data with tags
    const latestTagsData = await News.find({ tag: { $exists: true, $ne: [] } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("tag")
      .lean();

    if (!latestTagsData || latestTagsData.length === 0) {
      throw new Error("No news data found with tags.");
    }

    // Return the latest trending hashtag list
    res.status(200).json({
      success: true,
      message: "Latest trending hashtags retrieved successfully.",
      trendingTags: latestTagsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



module.exports = {
 getTrendingTags
};
