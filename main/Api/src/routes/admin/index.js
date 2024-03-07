const router = require("express").Router();
const languageRouter = require("../admin/adminLanguageRouter");
const categoryRouter = require("../admin/adminCategoryRouter");
const newsRouter = require("../admin/adminNewsRouter");
const tagRouter = require("../admin/tagRouter");
const subcategoryRouter = require("../admin/adminSubcategoryRouter");
const locationRouter = require("../admin/adminLocationRoute");
const faqsRouter = require("../admin/adminFaqsRouter");
const notifiRouter = require("../admin/adminNotificationRouter");
const adminRouter = require("../admin/adminRouter");

/* ---------------------------- admin Routers ---------------------------- */
router.use("/admin", adminRouter);

/* ---------------------------- Language Routers ---------------------------- */
router.use("/admin/language", languageRouter);

/* ---------------------------- Category Routers ---------------------------- */
router.use("/admin/category", categoryRouter);

/* ---------------------------- sub Category Routers ---------------------------- */
router.use("/admin/subcategory", subcategoryRouter);

/* ---------------------------- News Routers ---------------------------- */
router.use("/admin/news", newsRouter);

/* ---------------------------- Tag Routers ---------------------------- */
router.use("/admin/tag", tagRouter);

/* ---------------------------- Location Routers ---------------------------- */
router.use("/admin/location", locationRouter);

/* ---------------------------- FAQS Routers ---------------------------- */
router.use("/admin/faqs", faqsRouter);

/* ---------------------------- Notification Routers ---------------------------- */
router.use("/admin/notification", notifiRouter);

module.exports = router;
