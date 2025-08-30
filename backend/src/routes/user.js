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

    const data = connectionRequests.map((row) => row.fromUserId);

    res.json({
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
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
    res.status(400).send({ message: err.message });
  }
});

// ✅ 3. Feed API
// routes/user.js
// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;
//     console.log("Feed request from user:", loggedInUser._id);

//     const page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     limit = limit > 50 ? 50 : limit;
//     const skip = (page - 1) * limit;

//     // Find all connection requests involving the logged-in user
//     const connectionRequests = await ConnectionRequest.find({
//       $or: [
//         { fromUserId: loggedInUser._id },
//         { toUserId: loggedInUser._id },
//       ],
//     }).select("fromUserId toUserId");

//     console.log("Connection requests found:", connectionRequests.length);

//     const hideUserFromFeed = new Set();

//     connectionRequests.forEach((req) => {
//       hideUserFromFeed.add(req.fromUserId.toString());
//       hideUserFromFeed.add(req.toUserId.toString());
//     });

//     console.log("Hiding users from feed:", Array.from(hideUserFromFeed));

//     const users = await User.find({
//       $and: [
//         { _id: { $nin: Array.from(hideUserFromFeed) } },
//         { _id: { $ne: loggedInUser._id } },
//       ],
//     })
//       .select(USER_SAFE_DATA)
//       .skip(skip)
//       .limit(limit);

//     console.log("Users found for feed:", users.length);
//     res.send(users);
//   } catch (error) {
//     console.error("Error in /feed endpoint:", error);
//     res.status(400).json({ error: error.message });
//   }
// });

// routes/user.js - Update the feed endpoint
// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;

//     // Get all users except the logged-in user
//     const users = await User.find({
//       _id: { $ne: loggedInUser._id }
//     }).select(USER_SAFE_DATA);

//     res.send(users);
//   } catch (error) {
//     console.error("Error in /feed endpoint:", error);
//     res.status(400).json({ error: error.message });
//   }
// });

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("Fetching feed for user:", loggedInUser._id);

    // Get all users except the logged-in user
    const users = await User.find({
      _id: { $ne: loggedInUser._id }
    }).select(USER_SAFE_DATA);

    console.log("Found users:", users.length);
    res.send(users);
  } catch (error) {
    console.error("Error in /feed endpoint:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
