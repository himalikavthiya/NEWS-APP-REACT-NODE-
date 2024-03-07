const Location = require("../../models/locationModel");

/* --------------------------- add Location data --------------------------- */
const addLocation = async (req, res) => {
  console.log("object");
  try {
    const reqbody = req.body;
    const addData = await Location.create(reqbody);

    if (!addData) {
      return res.status(404).json({ message: "Location data not found" });
    }
    res.status(200).json({
      success: true,
      message: "Location data add successfully!",
      data: addData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* --------------------------- get list Location data --------------------------- */
const getLocation = async (req, res) => {
  try {
    const locationData = await Location.find();

    if (!locationData) {
      return res.status(404).json({ message: "Location Data not found" });
    }

    res.status(200).json({
      success: true,
      message: "List of Location Data successfully ",
      personalize: locationData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------- delete Category data ----------------------------- */
const deleteLocation = async (req, res) => {
  try {
    const locationData = await Location.findById(req.params.id);

    if (!locationData) {
      return res.status(404).json({ message: "Location data not found" });
    }
    const deleteLocation = await Location.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Location data deleted successfully",
      Location: deleteLocation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------- update Category data ----------------------------- */
const updateLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const locationData = await Location.findById(id);

    if (!locationData) {
      return res.status(404).json({ message: "Location data not found" });
    }

    const updateCateData = await Location.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateCateData) {
      throw new Error("Something went wrong, try again later");
    }

    res.status(200).json({
      success: true,
      message: "Location data deleted successfully",
      Location: updateCateData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { addLocation, getLocation, deleteLocation, updateLocation };
