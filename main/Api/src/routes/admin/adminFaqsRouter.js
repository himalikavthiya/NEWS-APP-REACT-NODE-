const { addFaqs, getAllFaqs, updateFaqs } = require("../../controllers/admin/adminSettingController");

const router = require("express").Router();

/* ------------------------- add FAQS route ------------------------ */
router.post("/add-Faqs", addFaqs);

/* ------------------------- get all FAQS route ------------------------ */
router.get("/get-Faqs", getAllFaqs);

/* ------------------------- add FAQS route ------------------------ */
router.put("/update-Faqs", updateFaqs);


module.exports = router;