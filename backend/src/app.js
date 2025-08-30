// // app.js

// app.js
const express = require('express');
const connnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
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

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect DB and start server
connnectDB()
  .then(() => {
    console.log("Database connection established");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected:", err);
  });

module.exports = app;



// const express = require('express');
// const connnectDB = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require('cors');
// const app = express();

// // Enable CORS
// app.use(cors({
//   origin: 'http://localhost:3000', 
//   credentials: true
// }));

// // Middleware
// app.use(express.json());
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });
// app.use(cookieParser());

// // Import routes
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");

// // Use routers
// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);

// // Connect DB and start server
// connnectDB()
//   .then(() => {
//     console.log("Database connection established");
//     const PORT = process.env.PORT || 3001; // Use 3001 consistently
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Database cannot be connected:", err);
//   });

// module.exports = app;