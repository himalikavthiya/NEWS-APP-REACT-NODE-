const Languages = require("../../models/languagesModel");

/* --------------------------- add Languages data --------------------------- */
const addLanguage = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.files["jsonFile"][0]) {
      reqbody.jsonFile = req.files["jsonFile"][0].filename;
    }

    if (req.files["flagImage"][0]) {
      reqbody.flagImage = req.files["flagImage"][0].filename;
    }

    const addData = await Languages.create(reqbody);

    if (!addData) {
      return res.status(404).json({ message: "language data not found" });
    }

    // const baseUrl =
    //   req.protocol +
    //   "://" +
    //   req.get("host") +
    //   process.env.BASE_URL_CATEGORY_PATH;

    res.status(200).json({
      success: true,
      message: "language data add successfully!",
      data: addData,
      // baseUrl: baseUrl,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------------------- list of Languages --------------------------- */
const getLanguage = async (req, res) => {
  try {
    const LanguageData = await Languages.find();

    if (!LanguageData) {
      return res.status(404).json({ message: "Language Data not found" });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_CATEGORY_PATH;

    res.status(200).json({
      success: true,
      message: "List of Language Data successfully ",
      language: LanguageData,
      baseUrl: baseUrl,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------- list of Languages --------------------------- */
const deleteLanguage = async (req, res) => {
  try {
    const LanguageData = await Languages.findById(req.params.id);

    if (!LanguageData) {
      return res.status(404).json({ message: "Language Data not found" });
    }
    const DeletedData = await Languages.findByIdAndDelete(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "List of Language Data successfully ",
      language: DeletedData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
/* ----------------------------- update Languages  data ----------------------------- */
const updateLanguage = async (req, res) => {
  try {
  
    const Language = await Languages.findById(req.params.id);

    if (!Language) {
      return res.status(404).json({ message: "Language data not found" });
    }
    if (req.file && req.file != "undefined") {
      req.body.flagImage = req.file.filename;
    }
   if (req.file && req.file != "undefined") {
     req.body.jsonFile = req.file.filename;
   }

    const updatedData = await Languages.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedData) {
      throw new Error("Something went wrong, try again later");
    }

    res.status(200).json({
      success: true,
      message: "Language data deleted successfully",
      language: updatedData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { addLanguage, getLanguage, deleteLanguage, updateLanguage };
