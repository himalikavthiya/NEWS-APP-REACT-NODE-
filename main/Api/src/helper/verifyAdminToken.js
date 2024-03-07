const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

module.exports = async (req, res, next) => {
  let token = req.header("Authorization");

  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  if (!token) {
    return res.status(402).send("Access Denied.");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);

    let admin = await Admin.findOne({ email: verified.email });

    if (!admin) {
      return res.status(402).send("Access Denied.");
    }

    req.admin = admin;
    req.token = token;

    next();
  } catch (error) {
    res.status(402).json({
      status: false,
      message: "Invalid Token",
    });
  }
};
