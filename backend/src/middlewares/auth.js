const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req , res , next) => {
try{
    const{ token } = req.cookies;

    if(!token){
        throw new Error("token is not valid");
    }

    const decodedObj = await jwt.verify(token , "DEV@TINDER$790");
    const {_id } = decodedObj;
    const user = await User.findById( _id);

    if(!user){
        throw new Error("user is not found");
    }req.user = user;

    next();}
    
catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
};


module.exports = {
    userAuth,
}

//write code for authentication of user or anyone befor acceess to data