const Notification = require("../../models/notificationModel");

/* -------------------------- Get All Notification -------------------------- */
const getAllNotification = async (req, res, next) => {
  try {
    const allNoti = await Notification.find();

    if (!allNoti) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification create successfully ",
      result: allNoti,
    });
  } catch (err) {
    next(err);
  }

};

const deleteAllNotification= async (req, res, next) => {
  try {

    // Delete all records in the User collection
    await Notification.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All user records deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllNotification,
  deleteAllNotification
};
