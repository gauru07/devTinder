const express = require('express');
const connnectDB = require("./config/database");
const { getMaxListeners } = require('./models/user');
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");
//require('dotenv').config();



app.use(express.json());
app.use(cookieParser()); 


//singup API -> /signup -> filling data in databse
app.post("/signup" , async (req , res) => { 
 try{ 
    //validation of signup data
    validateSignUpData(req);
    
    const {firstName , lastName , emailId , password} = req.body;
    //encrypting password
    const passwordHash = await bcrypt.hash(password, 10 );
    //console.log(passwordHash);
     
   //Creating a new instance of the User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        });

    await user.save(); // function returning a promiese.
    res.send("user added Succesfully");
  } catch(err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});

//login API 
//1. check Credential are valid or not.
//2. check password is correct using bcrypt
app.post("/login", async (req , res) => {
   try{
    const { emailId , password } = req.body;

    //validateSignUpData(req);
    const user = await User.findOne({ emailId : emailId });
    if(!user){
        throw new Error("Invalid Credentials");
    }
                                       
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
        //Craete JWT tocken
        const token = await user.getJWT();

        //add tocken to cookie and send response to user
        res.cookie("token" , token , {
            expires: new Date(Date.now() + 8 * 3600000) , });
        res.send("login Succesfull");
    }else{
        throw new Error("Wrong password")
    }
   }catch (err) {
        res.status(400).send("ERROR : " + err.message);
   }  
});

//profilr APi

app.get("/profile" , userAuth , async(req , res) => {
   try{
     const user =  req.user;
     res.send(user);
   }catch(err){
     res.status(400).send("ERROR : " + err.message );
    }
});

//How to find 1 user from database by email
app.get("/user" , userAuth , async (req , res) => {
    const userEmail = req.body.emailId;
    try{
        const users =  await User.find({ emailId: userEmail });
        if(users.length === 0){
            res.status(404).send("user not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Error : " + err.message);
    } 
});

//Feed API - /feed -> get the all user from data base
app.get("/feed" , userAuth , async (req , res) => {

    try{
        const users = await User.find({});
        res.send(users);

    }catch(err){
        res.status(404).send("users are not avilable");
    }

});

//delete API - /delete
app.delete("/user" , userAuth,  async (req , res) => {

    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted Successfully");

    }catch(err){
        res.status(400).send("Something get wrong")
    }
});

//update API -> /update -> update data in user
app.patch("/user/userId" , userAuth , async(req, res)=> {
    const userId = req.params?.userId;
    const data = req.body;
 try{
    const ALLOWED_UPDATES = [
     "photoUrl" , "about" , "gender" , "age"
    ];

    const isUpadteAllowed = Object.keys(data).every(k =>
        ALLOWED_UPDATES.includes(k)
    );
    if(!isUpadteAllowed){
       throw new Error("Update not allowed");
    }
    
    const user =  await User.findByIdAndUpdate( { _id: userId } , data, {
         returnDocument: "after",
         runValidators: true,
      });
        console.log(user);
        res.send("user is upadted");

 }catch(err){
        res.status(400).send("Update Failed" + err.message);
    }
});

app.post("/sendConnectionRequest" , userAuth, async (req , res) => {
    const user = req.user;

    //sending a connection request to the user
    console.log("sending a connection request to the user");

    res.send(user.firstName + "send the connection request!");
});

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

