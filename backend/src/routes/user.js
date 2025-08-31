const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// SAFE fields to send to frontend
const USER_SAFE_DATA =
  "firstName lastName age gender Skills about photoUrl preference location education work religion languages relationshipType smoking drinking prompts";

// ✅ 1. Get all the pending connection requests for logged-in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate({
      path: "fromUserId",
      select: USER_SAFE_DATA, // ✅ include full safe data
    });

    // Fix: Return proper structure with requestId
    const data = connectionRequests.map((request) => ({
      requestId: request._id,
      user: request.fromUserId,
      status: request.status,
      createdAt: request.createdAt
    }));

    res.json({
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ 2. Get all connections (matches)
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate({
        path: "fromUserId",
        select: USER_SAFE_DATA, // ✅ include full safe data
      })
      .populate({
        path: "toUserId",
        select: USER_SAFE_DATA, // ✅ include full safe data
      });

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ 3. Feed API - Fixed to return proper data structure
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("Fetching feed for user:", loggedInUser._id);

    // Get all users except the logged-in user
    const users = await User.find({
      _id: { $ne: loggedInUser._id }
    }).select(USER_SAFE_DATA);

    console.log("Found users:", users.length);
    
    // Fix: Return data wrapper as expected by frontend
    res.json({ data: users });
  } catch (error) {
    console.error("Error in /feed endpoint:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
