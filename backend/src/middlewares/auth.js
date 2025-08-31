const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // verify token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET || "DEV@TINDER$790");
    const { _id } = decodedObj;

    // fetch full user
    const user = await User.findById(_id).select("-password"); // don't send hashed password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // attach user object to request
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = {
  userAuth,
};
