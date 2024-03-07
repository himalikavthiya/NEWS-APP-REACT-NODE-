const Notification = require("../../models/notificationModel");

/* ---------------------------- Add Notification ---------------------------- */
const addNotification = async (req, res, next) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.notifiImage = req.file.filename;
    }

    const notifiData = await Notification.create(reqbody);

    if (!notifiData) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification create successfully ",
      result: notifiData,
    });
  } catch (err) {
    next(err);
  }
};

/* ----------------------- Delete Single Notification ----------------------- */
const deleteNotification = async (req, res, next) => {
  try {
    const id = req.params.id;
    const noti = await Notification.findById(id);

    if (!noti) {
      return res.status(404).json({ message: "Notification data not found" });
    }
    await Notification.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully!",
      data: noti,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addNotification, deleteNotification };
