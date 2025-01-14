//Its about user , what feild user will need.

const mongoose =  require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLength:50,
        index: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,

    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type : Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value){
                 if(!["male" , "female", "others"].includes(value)){
                    throw new Error("Gender is not valid");
                 }
        },
    },
    photoUrl:{
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
    },
    about:{
        type: String,
        default: "This is Default about of user",
    },
    Skills:{
        type:[String],
    },

} , {
    timestamps:true,
});


userSchema.methods.getJWT = async function () {
    const user = this;
   const token = await jwt.sign({_id: user._id } , "DEV@TINDER$790" , { expiresIn: "1d" ,
            });
            return token;
};


userSchema.methods.validatePassword= async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
     );
     return isPasswordValid;
};

// userSchema.methods.getJWT = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Default to 1 day if not specified
//     });
// };


module.exports = mongoose.model("User" , userSchema);