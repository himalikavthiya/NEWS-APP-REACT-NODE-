const express = require("express");
const { getAllNotification, deleteAllNotification } = require("../../controllers/app/appNotificationController");


const router = express.Router();

router.get("/get-allnoti", getAllNotification);

router.delete("/delete-allnoti", deleteAllNotification);

module.exports = router;