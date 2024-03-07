const Faqs = require("../../models/faqsModel");

/* ---------------------------- Add FAQs question --------------------------- */
const addFaqs = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    const newFaqs = await Faqs.create({
      question,
      answer,
    });

    const result = await newFaqs.save();

    res.status(200).json({
      success: true,
      message: "FAQS set successfully ",
      result: result,
    });
  } catch (err) {
    next(err);
  }
};
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

/* ------------------------------- Update FAQs ------------------------------ */
const updateFaqs = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const faqs = await Faqs.findById(req.params.id);

    if (!faqs) {
      return res.status(404).json({ message: "Faqs not found" });
    }

    faqs.question = question;
    faqs.answer = answer;

    const result = await faqs.save();
    
     res.status(200).json({
       success: true,
       message: "FAQS get successfully ",
       result: result,
     });
  } catch (err) {
    next(err);
  }
};

module.exports = { addFaqs, getAllFaqs, updateFaqs };
