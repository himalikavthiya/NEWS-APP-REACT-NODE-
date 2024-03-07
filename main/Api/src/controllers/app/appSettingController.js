const { sendMail } = require("../../helper/emailsend");
const Faqs = require("../../models/faqsModel");
const Feedback = require("../../models/feedbackModel");
const ejs = require("ejs");
const User = require("../../models/userModel");
const dotenv = require("dotenv").config();
/* ---------------------------- Get All FAQs question --------------------------- */
const getAllFaqs = async (req, res, next) => {
  try {
    const faqs = await Faqs.find();

    if (!faqs) {
      return res.status(404).json({ message: "Faqs not found" });
    }

    res.status(200).json({
      success: true,
      message: "FAQS get successfully ",
      result: faqs,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------- add feedback  --------------------------- */
const addFeedback = async (req, res, next) => {
  try {
    const { userId, feedback } = req.body;

    if (!userId || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Invalid input parameters",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newsFeedback = await Feedback.create({
      userId: userId,
      feedback: feedback,
    });

    // Render the EJS template
    const emailTemplate = await ejs.renderFile("../Api/views/feedback.ejs", {
      username: user.userName,
      useremail: user.email,
      usermo: user.mobile,
      feedback: req.body.feedback,
    });
    // send mail service is use by email service
    sendMail(
      user.email, //from
      process.env.EMAIL_FROM, //to
      emailTemplate,
      "News application"
    );
   
    res.status(200).json({
      success: true,
      message:
        "Your request has been sent successfully. We will respond to you as soon as possible.",
      result: newsFeedback,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFaqs,
  addFeedback,
};
