const express = require("express");
const {
  addNotification,
  deleteNotification,
} = require("../../controllers/admin/adminNotificationController");
const { singleFileUpload } = require("../../helper/upload");

const router = express.Router();

/* ----------------------- add sub category route ----------------------- */
router.post(
  "/add-Notifi",
  singleFileUpload("/notifImages", "notifiImage"),
  addNotification
);
router.delete("/delete-Notifi/:id", deleteNotification);

module.exports = router;
