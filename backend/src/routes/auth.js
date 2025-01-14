const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();


//Signup API
authRouter.post("/signup" , async (req , res) => { 
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

//Login API
authRouter.post("/login", async (req , res) => {
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

//LogOut API
authRouter.post("/logout" , async (req, res) => {
    res.cookie("token" , null, {
        expires: new Date(Date.now()),
    });
    res.send("You are LogOut!");
  });


module.exports = authRouter;