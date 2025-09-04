const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      profilePic,
      photos,
      bio,
      sexualOrientation,
      interestedIn,
      relationshipType,
      height,
      location,
      education,
      jobTitle,
      company,
      religion,
      ethnicity,
      languagesSpoken,
      drinking,
      smoking,
      prompts,
    } = req.body;

    // ✅ validate data
    validateSignUpData(req);

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ emailId: emailId.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        error: "Email already registered. Please use a different email or try logging in." 
      });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user with proper defaults
    const user = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(), // Ensure email is lowercase
      password: passwordHash,
      age: Number(age),
      gender,
      profilePic: profilePic || "",
      photos: photos || [],
      bio: bio || "",
      sexualOrientation: sexualOrientation || "",
      interestedIn: interestedIn || "",
      relationshipType: relationshipType || "unsure",
      height: height || "",
      location: location || "",
      education: education || "",
      jobTitle: jobTitle || "",
      company: company || "",
      religion: religion || "",
      ethnicity: ethnicity || "",
      languagesSpoken: languagesSpoken || [],
      drinking: drinking || "",
      smoking: smoking || "",
      prompts: prompts || "",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    
    // Handle MongoDB duplicate key errors specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Email already registered. Please use a different email or try logging in." 
      });
    }
    
    res.status(400).json({ error: err.message });
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Create JWT
    const token = await user.getJWT();

    // Set cookie with cross-origin support
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Allow cross-origin requests
      domain: ".onrender.com", // Allow subdomains
      path: "/",
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Add this to your auth routes
authRouter.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEV@TINDER$790");
    const user = await User.findById(decoded._id).select("-password");
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Logout API
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // Allow cross-origin requests
    domain: ".onrender.com", // Allow subdomains
    path: "/",
    expires: new Date(0),
  });
  res.json({ message: "You are logged out!" });
});

module.exports = authRouter;
