const User = require("../../models/userModel");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
const accessSecret = process.env.JWT_SECRECT_KEY;
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const { sendMail } = require("../../helper/emailsend");
const News = require("../../models/newsModel");
const Location = require("../../models/locationModel");

/* ---------------------------- Register User Data ---------------------------- */
const signupUser = async (req, res) => {
  try {
    const reqbody = req.body;

    // Check if both password and confirm_password are present
    if (!reqbody.password || !reqbody.confirm_password) {
      throw new Error(`Both password and confirm_password are required`);
    }

    /** find email and mobile number existence */
    const existingUser = await User.findOne({
      $or: [{ email: reqbody.email }, { mobile: reqbody.mobile }],
    });

    if (existingUser) {
      // throw new Error(`Email or mobile number already in use`);
    }

    /** validate password and confirm password equality */
    if (reqbody.password !== reqbody.confirm_password) {
      throw new Error(`Password and confirm password do not match`);
    }

    /** create access token */
    const payload = {
      fullName: reqbody.fullName,
      email: reqbody.email,
      expiresIn: moment().add(5, "minutes").unix(),
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRECT_KEY);

    /** generate Refresh Token */
    const generateRefreshToken = (payload) => {
      return jwt.sign(payload, refreshSecret);
    };

    const refreshToken = generateRefreshToken(payload);

    const newUser = {
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,

      accessToken: accessToken,
    };

    /** create user using createUser service */
    const user = await User.create(newUser);

    res.status(201).json({
      message: "User data created successfully!",
      data: user,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* ------------------------------- User Login ------------------------------- */
const loginUser = async (req, res) => {
  try {
    let { email, mobile, password } = req.body;

    /** find email and mobile number existence */
    const findUser = await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (!findUser) {
      throw new Error("User not Found");
    }

    /**compare password   */
    const successPassword = await bcrypt.compare(password, findUser.password);

    if (!successPassword) throw Error("Inccorect Password");

    /**create Token */
    let payload = {
      email,
      expiresIn: moment().add(10, "minutes").unix(),
    };

    /**create accesstoken */
    let accessToken;

    if (findUser && successPassword) {
      accessToken = await jwt.sign(payload, process.env.JWT_SECRECT_KEY);
      findUser.accessToken = accessToken;
    }

    /**generate Refresh token */
    const generateRefreshToken = (payload) => {
      return jwt.sign(payload, refreshSecret);
    };
    const refreshToken = generateRefreshToken(payload);

    res.status(200).json({
      success: true,
      message: `User Login successfully!`,
      findUser: findUser,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ----------------------------- Forgot password mail send ----------------------------- */
const forgotPasswordEmail = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email Id" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    user.otp = {
      value: otp,
      expiration: expirationTime,
    };

    // Save the OTP in the user document
    user.otp = otp; //otp is user model key name
    await user.save();

    // Render the EJS template
    const emailTemplate = await ejs.renderFile(
      "./src/Api/views/email_otp.ejs",
      {
        otp,
      }
    );
    // send mail service is use by email service
    const mailSent = sendMail(
      process.env.EMAIL_FROM,// from email
      email,//to email
      emailTemplate,
      "Password Reset OTP"
    );

    if (!mailSent) {
      // If email sending fails, handle the error
      res.status(404).json({
        success: false,
        message: "Failed to send email with OTP",
      });
    }
    res.status(200).json({
      success: true,
      message: `Check your email for the OTP: ${otp}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ----------------------------- Reset Password ----------------------------- */
const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  try {
    // Find the user by email and verify OTP
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    // Check if the new password and confirm password match

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Update the user's password and clear the OTP
    user.password = newPassword;
    user.otp = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
/* ---------------------------- Get RefreshToken ---------------------------- */
const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(402).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      refreshSecret // refresh token key from env
    );

    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(401).send("Invalid Username!");

    const token = jwt.sign(
      { email: decoded.email },
      accessSecret, //access secret key from env
      {
        expiresIn: "2m",
      }
    );
    res.status(200).json({ success: true, refreshToken: token });
  } catch (err) {
    next(err);
  }
};
/* ----------------------------- update user profile ----------------------------- */
const updateUserProfile = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.userProfileImg = req.file.filename;
    }

    const user = await User.findById(reqbody.userId);

    if (!user) {
      throw new Error("User Data not found");
    }
    if (reqbody.dob) {
      const dateOfBirth = new Date(reqbody.dob);
      reqbody.dob = dateOfBirth.getTime();
    }

    // Update user data in the database
    const isUpdate = await User.findByIdAndUpdate(
      reqbody.userId,
      {
        $set: reqbody,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      updateData: isUpdate,
      message: "update successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* ----------------------- update  auto play setting  ----------------------- */
const updateAutoPlay = async (req, res) => {
  try {
    const id = req.params.id;
    let updatedUserData = await User.findById(id);

    // Update user data in the database
    updatedUserData = await User.findByIdAndUpdate(
      id,
      { autoPlay: !updatedUserData.autoPlay },
      { new: true }
    );
    if (!updatedUserData) {
      throw new Error("User Data not found");
    }
    let resMessage = updatedUserData.autoPlay
      ? "Auto-play setting successfully enabled"
      : "Auto-play setting successfully disabled";

    res.status(200).json({
      success: true,
      updateData: updatedUserData,
      message: resMessage,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* ------------------------ update news location data ----------------------- */
const updateLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location parameter is missing.",
      });
    }

    const regex = new RegExp(location, "i");

    // const results = await News.find({
    //   location: { $in: await Location.find({ locationName: regex }) },
    // }).populate([
    //   {
    //     path: "category",
    //     select: ["categoryName"],
    //   },
    //   {
    //     path: "languages",
    //     select: ["languagesName"],
    //   },
    // ]);

    const results = await News.aggregate([
      {
        $match: {
          location: {
            $in: (
              await Location.find({ locationName: regex })
            ).map((doc) => doc._id),
          },
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationData",
        },
      },
      {
        $unwind: "$locationData",
      },
      // {
      //   $project: {
      //     _id: 1,
      //          category: { $arrayElemAt: ["$category.categoryName", 0] },
      //      languages: { $arrayElemAt: ["$languages.languagesName", 0] },
      //     subcategory: { $arrayElemAt: ["$subcategory.subCategoryName", ] },
      //   },
      // },
    ]);
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching news found for the given location.",
      });
    }

    res.status(200).json({
      success: true,
      updateData: results,
      message: "Location update successful.",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ----------------------------- update  app Language data ----------------------------- */
const updateNewsLanguage = async (req, res) => {
  try {
    const { userId, languageId, categoryId } = req.body;
    console.log(req.body);

    // Find the news item by ID
    let user = await User.findById(userId);

    if (!user) {
      throw new Error("user not found");
    }

    const isUpdate = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: languageId,
        categoryId,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updateData: isUpdate,
      message: "News language updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

/* ----------------------------- update  app Language data ----------------------------- */
const updateAppLanguage = async (req, res) => {
  try {
    const { userId, newLanguageId } = req.body;

    // Validate input parameters
    if (!userId || !newLanguageId) {
      throw new Error("Invalid input parameters");
    }

    // Find the user by ID
    let updatedUser = await User.findById(userId);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    updatedUser = await User.findByIdAndUpdate(
      userId,
      { newLanguageId: updatedUser.language },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updateData: updatedUser,
      message: "User language updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  forgotPasswordEmail,
  resetPassword,
  RefreshToken,
  updateAutoPlay,
  updateLocation,
  updateUserProfile,
  updateNewsLanguage,
  updateAppLanguage,
};
