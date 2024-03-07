const {
  addLanguage,
  getLanguage,
  deleteLanguage,
  updateLanguage,
} = require("../../controllers/admin/adminLanguagesController");
const { multiDiffFileUpload } = require("../../helper/upload");
const verifyAdminToken = require("../../helper/verifyAdminToken");

const router = require("express").Router();

/* --------------------------- add Language route --------------------------- */
router.post(
  "/addLanguage",
  multiDiffFileUpload("/languagesFiles", [
    {
      name: "jsonFile",
      maxCount: 1,
      allowedMimes: ["application/json"],
    },
    {
      name: "flagImage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  addLanguage
);

/* ------------------------- get Language data route ------------------------ */
router.get("/get-Language",
 verifyAdminToken,
  getLanguage);

  /* ------------------------- delete Language data route ------------------------ */
router.delete("/delete-Language/:id", verifyAdminToken, deleteLanguage);

  /* ------------------------- update Language data route ------------------------ */
router.put(
  "/update-Language/:id",
  multiDiffFileUpload("/languagesFiles", [
    {
      name: "jsonFile",
      maxCount: 1,
      allowedMimes: ["application/json"],
    },
    {
      name: "flagImage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  verifyAdminToken,
  updateLanguage
);

module.exports = router;
