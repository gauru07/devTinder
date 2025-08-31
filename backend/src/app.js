// // app.js

// app.js
const express = require('express');
const connnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

// Use routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// Connect DB (server will be started in start.js)
connnectDB()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error("Database cannot be connected:", err);
  });

module.exports = app;