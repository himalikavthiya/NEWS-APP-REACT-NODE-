const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


module.exports = async(req, res, next)=> {
  
  let token = req.header("Authorization");

  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
   if (!token) {
     return res.status(402).send("Access Denied.");
   }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);

    let user = await User.findOne({ email: verified.email });

    if (!user) {
      return res.status(402).send("Access Denied.");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(402).json({
      status: false,
      message: "Invalid Token",
    });
  }
};


