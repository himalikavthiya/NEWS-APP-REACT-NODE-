const Admin = require("../../models/adminModel");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
const accessSecret = process.env.JWT_SECRECT_KEY;
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const { generateOTP, sendMail } = require("../../helper/emailsend");
const crypto = require("crypto");
const email_URL = process.env.Email_URL;

/* ----------------------------- Admin Register ----------------------------- */
const adminRegister = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.profileImage = req.file.filename;
    }

    const newAdmin = await Admin.create(reqbody);

    res.status(201).json({
      message: "admin data created successfully!",
      admin: newAdmin,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ------------------------------- admin Login ------------------------------- */
const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    /** find email and mobile number existence */
    const admin = await Admin.findOne({
      $or: [{ email: email }],
    });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "admin not found." });
    }

    /**compare password   */
    const successPassword = await bcrypt.compare(password, admin.password);

    if (!successPassword) throw Error("Inccorect Password");

    /**create Token */
    let payload = {
      email,
      expiresIn: moment().add(5, "minutes").unix(),
    };

    /**create accesstoken */
    let accessToken;

    if (admin && successPassword) {
      accessToken = await jwt.sign(payload, process.env.JWT_SECRECT_KEY);
      admin.accessToken = accessToken;
    }

    /**generate Refresh token */
    const generateRefreshToken = (payload) => {
      return jwt.sign(payload, refreshSecret);
    };
    const refreshToken = generateRefreshToken(payload);

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      success: true,
      message: `Admin Login successfully!`,
      admin: admin,
      refreshToken: refreshToken,
      baseUrl: baseUrl,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ------------------------------- admin List ------------------------------- */
const allAdminList = async (req, res) => {
  try {
    const admin = await Admin.find();

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "admin not found." });
    }

    res.status(200).json({
      success: true,
      message: "All Admin List Get successfully!",
      admin: admin,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ------------------------------- admin Forgot password ------------------------------- */
const forgotPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email Id" });

    let resetCode = crypto.randomBytes(32).toString("hex");

    const otp = generateOTP(); //generate otp code emailService through generate
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    admin.otp = {
      value: otp,
      expiration: expirationTime,
    };

    // Save the OTP in the user document
    admin.otp = otp; //otp is admin model key name
    admin.resetCode = resetCode;
    await admin.save();

    // Render the EJS template
    const emailTemplate = await ejs.renderFile(
      "../Api/src/views/email_otp.ejs",
      {
        otp,
        otpURL: `${email_URL}reset-password/${resetCode}/${admin._id}`,
      }
    );
    // "/home/himali/Documents/NEWS_APP_main/main/Api/src/views/email_otp.ejs",

    // send mail service is use by email service
    sendMail(
      process.env.EMAIL_FROM,
      admin.email,
      emailTemplate,
      "Password Reset OTP"
    );

    res.status(200).json({
      success: true,
      message: `Check your email for Reset password`,
    });
  } catch (err) {
    next(err);
    // res.status(500).json({
    //   success: false,
    //   message: err.message,
    // });
  }
};

/* ----------------------------- Reset Password ----------------------------- */
const resetPassword = async (req, res) => {
  const { otp, newPassword, confirmPassword } = req.body;

  try {
    // Find the user by email and verify OTP
    const admin = await Admin.findOne({ _id: req.body.id });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "admin not found." });
    }

    // Check if OTP is valid and not expired
    if (admin.otp != otp || admin.otpExpiration < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Update the user's password and clear the OTP and reset OTP expiration
    admin.password = newPassword;
    admin.otp = null;
    admin.otpExpiration = null;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------- Reset Password ----------------------------- */

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Get the user from the token
    const admin = await Admin.findById(req.body._id);

    // Check if the old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Update the user's password
    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------- Get RefreshToken ---------------------------- */
const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(402).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      refreshSecret // refresh token key from env
    );

    const admin = await Admin.findOne({ email: decoded.email });

    if (!admin) return res.status(401).send("Invalid admin Name!");

    const token = jwt.sign(
      { email: decoded.email },
      accessSecret, //access secret key from env
      {
        expiresIn: "20m",
      }
    );
    res.status(200).json({ success: true, admin: admin, refreshToken: token });
  } catch (err) {
    next(err);
  }
};

//Update Admin Profile
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const admin = await Admin.findById(req.body._id);

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "admin not found." });
    }

    if (req.file) {
      // deleteFiles(admin.profileImage);
      admin.profileImage = req.file.filename;
    }

    admin.name = name;
    const updatedData = await admin.save();

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      success: true,
      message: "Profile set successful.",
      admin: updatedData,
      baseUrl: baseUrl,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  allAdminList,
  forgotPasswordEmail,
  resetPassword,
  changePassword,
  refreshToken,
  updateProfile,
};
