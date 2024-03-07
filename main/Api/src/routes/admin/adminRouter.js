const express = require("express");
const {
  adminRegister,
  adminLogin,
  forgotPasswordEmail,
  resetPassword,
  changePassword,
  refreshToken,
  updateProfile,
  allAdminList,
} = require("../../controllers/admin/adminController");
const { singleFileUpload } = require("../../helper/upload");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const router = express.Router();

router.post(
  "/register",
  singleFileUpload("/adminImages", "profileImage"),
  adminRegister
);

router.post("/login", adminLogin);

router.get("/allAdminList", allAdminList);

router.post("/forgot-password", forgotPasswordEmail);

router.post("/reset-password", resetPassword);

router.post("/change-password", verifyAdminToken, changePassword);

router.post(
  "/edit-profile",
  singleFileUpload("/adminImages/", "profileImage"),
  verifyAdminToken,
  updateProfile
);

router.post("/refreshToken", refreshToken);

module.exports = router;
