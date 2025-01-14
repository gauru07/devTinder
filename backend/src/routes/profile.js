const express = require('express');
const profileRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData, passwordValidator} = require("../utils/validation");
const user = require('../models/user');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing


profileRouter.get("/profile/view" , userAuth , async(req , res) => {
    try{
      const user =  req.user;
      res.send(user);
    }catch(err){
      res.status(400).send("ERROR : " + err.message );
     }
 });

profileRouter.patch("/profile/edit" , userAuth , async(req , res) =>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("invalid edit request!");
        }
     const loggedInUser =  req.user;

     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
     await loggedInUser.save();

     res.json({
        message: `${loggedInUser.firstName}, your profile is updated succesfull` ,
        data: loggedInUser,
    });
    }catch (err){
        res.status(400).send("ERROR" + err.message );
    }

 });

profileRouter.patch("/profile/password" , userAuth , async(req , res) => {
       try{
        //vallidation of password like bcrypt
        validateProfileEditData(req);

        //new password
        const { password } = req.body;
        
        //encrypting password/Hash
        const passwordHash = await bcrypt.hash(password, 10 );

        //fetch logged user
        const loggedInUser = req.user;

        //updating the user password
        loggedInUser .password = passwordHash;
        await loggedInUser.save();
        res.send("Password is updated Successfully!")
       }catch (err){
        res.status(400).send("ERROR" + err.message );
       }
 });

module.exports = profileRouter;