const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email Id is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImage: {
      type: String,
    },
    
    otp: {
      type: String,
      default: null,
    },
    expireOtpTime: {
      type: Date,
      default: null,
    },
    resetCode: {
      type: String,
    },
    accessToken: {
      type: String,
    },
     },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Bcrypt password before save
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hashSync(admin.password, 10);
  }
  next();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
