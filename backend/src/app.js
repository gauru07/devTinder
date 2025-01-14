const express = require('express');
const connnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();


app.use(express.json());
app.use(cookieParser()); 

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/", userRouter);



connnectDB()
.then( () => {
    console.log("dataBase connection established");
    app.listen(3000 , () => {
        console.log("server is succefully listening on port 3000");
    });  
})
.catch((err) => {
        console.error("DataBase cannot be connected");
});

