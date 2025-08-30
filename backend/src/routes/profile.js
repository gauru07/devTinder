const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData, passwordValidator } = require("../utils/validation");
const bcrypt = require("bcrypt");

// ==========================
// 🔹 View Logged-in Profile
// ==========================
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user); // send full user object (already from auth middleware)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
    res.status(400).send("ERROR: " + err.message);
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

    res.send("Password updated successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
