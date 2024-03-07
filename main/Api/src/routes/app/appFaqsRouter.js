const { getAllFaqs, addFeedback } = require("../../controllers/app/appSettingController");

const router = require("express").Router();


/* ------------------------- get all FAQS route ------------------------ */
router.get("/get-Faqs", getAllFaqs);

/* ------------------------- get all FAQS route ------------------------ */
router.post("/add-Feedback", addFeedback);

module.exports = router;
