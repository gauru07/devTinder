const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // Basic info
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },

    // Photos
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
    },
    photos: {
      type: [String],
      default: [],
    },

    // Bio
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },

    // Preferences & Lifestyle
    sexualOrientation: {
      type: String,
      default: "",
    },
    interestedIn: {
      type: String,
      default: "",
    },
    relationshipType: {
      type: String,
      enum: ["serious", "casual", "open", "unsure", "dating"],
      default: "unsure",
    },
    height: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    religion: {
      type: String,
      default: "",
    },
    ethnicity: {
      type: String,
      default: "",
    },
    languagesSpoken: {
      type: [String],
      default: [],
    },
    drinking: {
      type: String,
      enum: ["yes", "no", "sometimes", ""],
      default: "",
    },
    smoking: {
      type: String,
      enum: ["yes", "no", "sometimes", ""],
      default: "",
    },

    // Prompts - changed from array of objects to simple string
    prompts: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔑 JWT auth token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || "DEV@TINDER$790",
    { expiresIn: "1d" }
  );
  return token;
};

// ✅ Password validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  return await bcrypt.compare(passwordInputByUser, passwordHash);
};

module.exports = mongoose.model("User", userSchema);