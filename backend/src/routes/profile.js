const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData, passwordValidator } = require("../utils/validation");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

// ==========================
// 🔹 Multer Configuration for File Uploads
// ==========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==========================
// 🔹 View Logged-in Profile
// ==========================
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user); // send full user object (already from auth middleware)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Edit Profile
// ==========================
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid fields in update request!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Update Profile (Frontend Compatibility)
// ==========================
profileRouter.put("/profile/update", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid fields in update request!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Upload Profile Photos
// ==========================
profileRouter.post("/profile/upload-photos", userAuth, upload.array('photos', 5), async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Get file paths
    const photoUrls = req.files.map(file => `/${file.path}`);
    
    // Add photos to user's photos array
    if (!loggedInUser.photos) {
      loggedInUser.photos = [];
    }
    
    loggedInUser.photos.push(...photoUrls);
    
    // Keep only the latest 5 photos
    if (loggedInUser.photos.length > 5) {
      loggedInUser.photos = loggedInUser.photos.slice(-5);
    }
    
    await loggedInUser.save();

    res.json({
      success: true,
      message: "Photos uploaded successfully",
      photos: photoUrls
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Delete Profile Photo
// ==========================
profileRouter.delete("/profile/delete-photo/:photoIndex", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const photoIndex = parseInt(req.params.photoIndex);
    
    if (!loggedInUser.photos || photoIndex < 0 || photoIndex >= loggedInUser.photos.length) {
      return res.status(400).json({ error: "Invalid photo index" });
    }
    
    // Remove photo at specified index
    loggedInUser.photos.splice(photoIndex, 1);
    await loggedInUser.save();

    res.json({
      success: true,
      message: "Photo deleted successfully",
      photos: loggedInUser.photos
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Set Main Profile Photo
// ==========================
profileRouter.put("/profile/set-main-photo", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { photoUrl } = req.body;
    
    if (!photoUrl) {
      return res.status(400).json({ error: "Photo URL is required" });
    }
    
    // Check if the photo exists in user's photos array
    if (!loggedInUser.photos || !loggedInUser.photos.includes(photoUrl)) {
      return res.status(400).json({ error: "Photo not found in user's photos" });
    }
    
    // Set as main photo
    loggedInUser.photoUrl = photoUrl;
    await loggedInUser.save();

    res.json({
      success: true,
      message: "Main photo updated successfully",
      photoUrl: loggedInUser.photoUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// 🔹 Change Password
// ==========================
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    // validate new password
    if (!passwordValidator(password)) {
      throw new Error("Password does not meet security requirements.");
    }

    const loggedInUser = req.user;

    // encrypt password
    loggedInUser.password = await bcrypt.hash(password, 10);
    await loggedInUser.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = profileRouter;
