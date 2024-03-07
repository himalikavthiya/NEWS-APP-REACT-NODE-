const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email Id is required."],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile no is required."],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: `Mobile number is not valid.`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    yourBio: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Number,
    },
    userProfileImg: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    otp: {
      type: String,
      maxlength: [6, "OTP should be maximum six characters."],
      default: "",
    },
    expiration: {
      type: Date,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    newsLanguage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: [true, "language name is required."],
      },
    ],
    appLanguage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: [true, "language name is required."],
      },
    ],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

/*password bcrypt */
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
    next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
